import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { Integer } from 'neo4j-driver';
import 'reflect-metadata';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qb = new QueryBuilder(neo4jFixture.getDriver());

describe('Number Transformer', () => {
  beforeAll(async () => {
    await qb.save(new Node(id.get('id'), 1, 1.1)).run();
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
    const result = await qb
      .findOne(TestGraph, 'tg')
      .where(null, '{n}.id = $id')
      .buildQuery({ id: id.get('id') })
      .run();

    expect(result).toStrictEqual(new TestGraph(new Node(id.get('id'), 1, 1.1)));
  });
});
