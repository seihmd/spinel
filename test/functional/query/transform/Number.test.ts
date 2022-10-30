import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { SaveQueryPlan } from '../../../../src/query/builder/save/SaveQueryPlan';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { Property } from '../../../../src/decorator/property/Property';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { WhereQueries } from '../../../../src/query/builder/where/WhereQueries';
import { WhereQuery } from '../../../../src/query/builder/where/WhereQuery';
import { Graph } from '../../../../src/decorator/class/Graph';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { Integer } from 'neo4j-driver';
import { QueryPlan } from '../../../../src/query/builder/match/QueryPlan';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();

const int = (value: number) => Integer.fromValue(value);

describe('Number Transformer', () => {
  beforeAll(async () => {
    const saveQueryPlan = SaveQueryPlan.new(neo4jFixture.getDriver());
    const entity = new Node(id.get('id'), 1, 1.1);
    await saveQueryPlan.execute(entity);
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  @NodeEntity()
  class Node {
    @Primary()
    private id: string;

    @Property()
    private intNumber: number;

    @Property()
    private floatNumber: number;

    constructor(id: string, intNumber: number, floatNumber: number) {
      this.id = id;
      this.intNumber = intNumber;
      this.floatNumber = floatNumber;
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
      intNumber: Integer.fromValue(1),
      floatNumber: 1.1,
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
      new TestGraph(new Node(id.get('id'), 1, 1.1)),
    ]);
  });
});
