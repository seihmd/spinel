import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { SaveQueryPlan } from '../../../../src/query/builder/save/SaveQueryPlan';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { Property } from '../../../../src/decorator/property/Property';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { QueryPlan } from '../../../../src/query/builder/match/QueryPlan';
import { WhereQueries } from '../../../../src/query/builder/where/WhereQueries';
import { WhereQuery } from '../../../../src/query/builder/where/WhereQuery';
import { Graph } from '../../../../src/decorator/class/Graph';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { TransformerInterface } from '../../../../src/metadata/schema/transformation/transformer/TransformerInterface';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();

describe('Custom Transformer', () => {
  beforeAll(async () => {
    const saveQueryPlan = SaveQueryPlan.new(neo4jFixture.getDriver());
    const entity = new Node(id.get('id'), '_', 'not transformed');
    await saveQueryPlan.execute(entity);
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  class TestTransformer implements TransformerInterface {
    preserve(value: any): string {
      return 'preserved';
    }

    restore(value: any): string {
      return 'restored';
    }
  }

  @NodeEntity()
  class Node {
    @Primary()
    private id: string;

    @Property({ transformer: new TestTransformer() })
    private value: string;

    @Property()
    private value2: string;

    constructor(id: string, value: string, value2: string) {
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
      value: 'preserved',
      value2: 'not transformed',
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
      new TestGraph(new Node(id.get('id'), 'restored', 'not transformed')),
    ]);
  });
});
