import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { TransformerInterface } from 'metadata/schema/transformation/transformer/TransformerInterface';
import { DateTime, Integer } from 'neo4j-driver';
import 'reflect-metadata';
import { DateTimeTransformer } from '../../../src';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

const int = (value: number) => Integer.fromValue(value);

describe('Date Transformer', () => {
  const date = new Date('2000-01-02 03:04:05');

  beforeAll(async () => {
    await qd.save(new Node(id.get('id'), date, date, date, date));
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  class TestTransformer implements TransformerInterface {
    preserve(value: Date): string {
      return value.toString();
    }

    restore(value: string): Date {
      return new Date(value);
    }
  }

  @NodeEntity('Node')
  class Node {
    @Primary()
    private id: string;

    @Property({ transformer: new TestTransformer() })
    private value: Date;

    @Property()
    private value2: Date;

    @Property({ transformer: new DateTimeTransformer() })
    private value3: Date | null;

    @Property({ alias: 'aliased', transformer: new DateTimeTransformer() })
    private value4: Date | null;

    constructor(
      id: string,
      value: Date,
      value2: Date,
      value3: Date,
      value4: Date
    ) {
      this.id = id;
      this.value = value;
      this.value2 = value2;
      this.value3 = value3;
      this.value4 = value4;
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
    const expectedDate = new DateTime(
      int(2000),
      int(1),
      int(2),
      int(3),
      int(4),
      int(5),
      int(0),
      int(new Date().getTimezoneOffset() * -60)
    );

    expect(savedValue).toStrictEqual({
      id: id.get('id'),
      value: date.toString(),
      value2: expectedDate,
      value3: expectedDate,
      aliased: expectedDate,
    });
  });

  test('restore', async () => {
    const result = await qd
      .findOne(TestGraph)
      .where('n.id = $id')
      .buildQuery({
        id: id.get('id'),
      })
      .run();

    expect(result).toStrictEqual(
      new TestGraph(new Node(id.get('id'), date, date, date, date))
    );
  });
});
