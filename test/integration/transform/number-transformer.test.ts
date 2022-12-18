import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { Integer } from 'neo4j-driver';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Number Transformer', () => {
  beforeAll(async () => {
    await qd.save(new Node(id.get('id'), 1, 1.1));
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
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
    const result = await qd
      .findOne(TestGraph, 'tg')
      .where('{n}.id = $id')
      .buildQuery({ id: id.get('id') })
      .run();

    expect(result).toStrictEqual(new TestGraph(new Node(id.get('id'), 1, 1.1)));
  });
});
