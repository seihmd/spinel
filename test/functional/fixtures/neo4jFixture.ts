import neo4j, { Driver, Session } from 'neo4j-driver';
import { Node, Relationship } from 'neo4j-driver-core';
import { formatISO } from 'date-fns';
import { Direction } from '../../../src/domain/graph/Direction';

export class Neo4jFixture {
  static new(): Neo4jFixture {
    const driver = neo4j.driver(
      'neo4j://localhost',
      neo4j.auth.basic('neo4j', 'password')
    );
    return new Neo4jFixture(driver);
  }

  private readonly driver: Driver;
  private readonly database: string;
  private nodes: Node[];
  private relationships: Relationship[];

  constructor(driver: Driver, database = '') {
    this.driver = driver;
    this.nodes = [];
    this.relationships = [];
    this.database = database;
  }

  private session(): Session {
    return this.driver.session({
      database: this.database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  async addNode(
    label: string,
    properties: Record<string, unknown>
  ): Promise<Node> {
    const propExceptDate: Record<string, unknown> = {};
    const propDate: Record<string, Date> = {};
    Object.entries(properties).forEach(([key, value]) => {
      if (value instanceof Date) {
        propDate[key] = value;
      } else {
        propExceptDate[key] = value;
      }
    });

    const s: string = Object.entries(propDate)
      .map(([key, value]) => {
        return `n.${key} = datetime("${formatISO(value)}")`;
      })
      .join(',');
    const query = `CREATE (n: ${label}) SET n = $properties ${
      s.length > 0 ? ',' + s : ''
    } RETURN n;`;

    const q = await this.session().run(query, {
      properties: propExceptDate,
    });

    const node = q.records[0].get('n') as Node;
    if (!(node instanceof Node)) {
      throw new Error();
    }

    this.nodes.push(node);

    return node;
  }

  async addRelationship(
    type: string,
    properties: Record<string, unknown>,
    from: Node,
    to: Node,
    direction: Direction
  ): Promise<Relationship> {
    const left = direction === '<-' ? '<-' : '-';
    const right = direction === '->' ? '->' : '-';
    const q = await this.session().run(
      `MATCH
        (n1: ${from.labels[0]}),
        (n2: ${to.labels[0]})
        WHERE ID(n1) = $fromId AND ID(n2) = $toId
      CREATE (n1)${left}[r:${type}]${right}(n2)
      SET r = $properties
      RETURN r`,
      {
        fromId: from.identity.toNumber(),
        toId: to.identity.toNumber(),
        properties,
      }
    );

    const relationship = q.records[0].get('r') as Relationship;
    if (!(relationship instanceof Relationship)) {
      throw new Error();
    }

    this.relationships.push(relationship);

    return relationship;
  }

  async findNode(label: string, id: string): Promise<Record<string, unknown>> {
    const q = await this.session().run(
      `MATCH (n:${label} {id: "${id}"}) RETURN n`
    );

    const node = q.records[0].get('n') as Node;
    if (!(node instanceof Node)) {
      throw new Error();
    }

    this.nodes.push(node);

    return node.properties;
  }

  async findGraph(pattern: string): Promise<{ [key: string]: unknown }> {
    const q = await this.session().run(pattern);

    const result: { [key: string]: unknown } = {};
    for (const [key, entry] of q.records[0].entries()) {
      if (entry instanceof Node) {
        this.nodes.push(entry);
        result[key] = entry.properties;
        continue;
      }
      if (entry instanceof Relationship) {
        this.relationships.push(entry);
        result[key] = entry.properties;
        continue;
      }
      if (Array.isArray(entry)) {
        result[key] = entry.map((entryItem) => {
          if (entryItem instanceof Node) {
            this.nodes.push(entryItem);
            return entryItem.properties;
          }
          if (entryItem instanceof Relationship) {
            this.relationships.push(entryItem);
            return entryItem.properties;
          }

          return entryItem;
        });
        continue;
      }

      throw new Error();
    }
    return result;
  }

  async teardown(): Promise<void> {
    const ids: number[] = [
      ...this.nodes.map((n) => n.identity.toNumber()),
      ...this.relationships.map((r) => r.identity.toNumber()),
    ];

    await this.session().run(
      `UNWIND $ids AS id 
      MATCH (n) WHERE ID(n) = id 
      DETACH DELETE n;`,
      { ids }
    );

    await this.driver.close();
  }

  getDriver(): Driver {
    return this.driver;
  }
}
