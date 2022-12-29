import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import { Node } from 'neo4j-driver-core';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity()
class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('item')
class SimilarItems {
  @GraphNode()
  private item: Item;

  @GraphBranch(SimilarItems, 'item-[:IS_SIMILAR]->.item')
  private similarItems: SimilarItems[] = [];

  constructor(item: Item, similarItems: SimilarItems[]) {
    this.item = item;
    this.similarItems = similarItems;
  }
}

async function addItem(name: string): Promise<Node> {
  return await neo4jFixture.addNode('Item', {
    id: id.get(name),
  });
}

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find graph with depth', () => {
  beforeAll(async () => {
    const item = await addItem('item');
    const similar1 = await addItem('similar1');
    const similar2 = await addItem('similar2');
    const similar1_1 = await addItem('similar1_1');
    const similar1_2 = await addItem('similar1_2');
    const similar2_1 = await addItem('similar2_1');
    const similar2_2 = await addItem('similar2_2');

    await neo4jFixture.addRelationship('IS_SIMILAR', {}, item, similar1, '->');
    await neo4jFixture.addRelationship('IS_SIMILAR', {}, item, similar2, '->');
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      similar1,
      similar1_1,
      '->'
    );
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      similar1,
      similar1_2,
      '->'
    );
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      similar2,
      similar2_1,
      '->'
    );
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      similar2,
      similar2_2,
      '->'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test.each([
    [0, new SimilarItems(new Item(id.get('item')), [])],
    [
      1,
      new SimilarItems(new Item(id.get('item')), [
        new SimilarItems(new Item(id.get('similar2')), []),
        new SimilarItems(new Item(id.get('similar1')), []),
      ]),
    ],
    [
      2,
      new SimilarItems(new Item(id.get('item')), [
        new SimilarItems(new Item(id.get('similar2')), [
          new SimilarItems(new Item(id.get('similar2_2')), []),
          new SimilarItems(new Item(id.get('similar2_1')), []),
        ]),
        new SimilarItems(new Item(id.get('similar1')), [
          new SimilarItems(new Item(id.get('similar1_2')), []),
          new SimilarItems(new Item(id.get('similar1_1')), []),
        ]),
      ]),
    ],
  ])('find', async (depth: number, expected: SimilarItems) => {
    const query = qd
      .builder()
      .find(SimilarItems)
      .where('item.id=$item.id')
      .depth(depth)
      .buildQuery({
        item: { id: id.get('item') },
      });

    expect(await query.run()).toStrictEqual([expected]);
  });

  test('find with nested filterBranch', async () => {
    const query = qd
      .builder()
      .find(SimilarItems)
      .where('item.id=$itemId')
      .filterBranch('similarItems', '.item.id=$similarItemId')
      .filterBranch('similarItems.similarItems', '.item.id=$similarItemId2')
      .depth(2)
      .buildQuery({
        itemId: id.get('item'),
        similarItemId: id.get('similar1'),
        similarItemId2: id.get('similar1_2'),
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Item) ' +
        'WHERE n0.id=$itemId ' +
        'RETURN {item:n0{.*},' +
        'similarItems:[(n0)-[b0_r2:IS_SIMILAR]->(b0_n4:Item) ' +
        'WHERE b0_n4.id=$similarItemId|{item:b0_n4{.*},' +
        'similarItems:[(b0_n4)-[b0_b0_r2:IS_SIMILAR]->(b0_b0_n4:Item) ' +
        'WHERE b0_b0_n4.id=$similarItemId2|{item:b0_b0_n4{.*}}]}]} ' +
        'AS _'
    );

    expect(await query.run()).toStrictEqual([
      new SimilarItems(new Item(id.get('item')), [
        new SimilarItems(new Item(id.get('similar1')), [
          new SimilarItems(new Item(id.get('similar1_2')), []),
        ]),
      ]),
    ]);
  });
});
