import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { TransformerInterface } from 'metadata/schema/transformation/transformer/TransformerInterface';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Custom Transformer', () => {
  beforeAll(async () => {
    await qd.save(new Node(id.get('id'), '_', 'not transformed'));
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
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
    const result = await qd
      .findOne(TestGraph, 'tg')
      .where('{n}.id = $id')
      .buildQuery({
        id: id.get('id'),
      })
      .run();

    expect(result).toStrictEqual(
      new TestGraph(new Node(id.get('id'), 'restored', 'not transformed'))
    );
  });
});
