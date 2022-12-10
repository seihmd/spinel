import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { TransformerInterface } from 'metadata/schema/transformation/transformer/TransformerInterface';
import { DateTime, Integer } from 'neo4j-driver';
import { QueryPlan } from 'query/builder/match/QueryPlan';
import { SaveQueryPlan } from 'query/builder/save/SaveQueryPlan';
import { WhereQueries } from 'query/builder/where/WhereQueries';
import { WhereQuery } from 'query/builder/where/WhereQuery';
import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();

const int = (value: number) => Integer.fromValue(value);

describe('Date Transformer', () => {
  const date = new Date('2000-01-02 03:04:05');

  beforeAll(async () => {
    const saveQueryPlan = SaveQueryPlan.new(neo4jFixture.getDriver());
    const entity = new Node(id.get('id'), date, date);
    await saveQueryPlan.execute(entity);
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  class TestTransformer implements TransformerInterface {
    preserve(value: Date): string {
      return value.toString();
    }

    restore(value: string): Date {
      return new Date(value);
    }
  }

  @NodeEntity()
  class Node {
    @Primary()
    private id: string;

    @Property({ transformer: new TestTransformer() })
    private value: Date;

    @Property()
    private value2: Date;

    constructor(id: string, value: Date, value2: Date) {
      this.id = id;
      this.value = value;
      this.value2 = value2;
    }
  }

  @Graph('n')
  class TestGraph {
    @GraphNode() private n: Node;

    constructor(n: Node) {
      this.n = n;
    }
  }

  test('preserve', async () => {
    const savedValue = await neo4jFixture.findNode('Node', id.get('id'));
    expect(savedValue).toStrictEqual({
      id: id.get('id'),
      value: date.toString(),
      value2: new DateTime(
        int(2000),
        int(1),
        int(2),
        int(3),
        int(4),
        int(5),
        int(0),
        int(new Date().getTimezoneOffset() * -60)
      ),
    });
  });

  test('restore', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());
    const whereQueries = new WhereQueries([
      new WhereQuery(null, '{n}.id = $id'),
    ]);

    const results = await queryPlan.execute(TestGraph, {
      whereQueries,
      parameters: {
        id: id.get('id'),
      },
    });

    expect(results).toStrictEqual([
      new TestGraph(new Node(id.get('id'), date, date)),
    ]);
  });
});
