import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { Graph } from '../../../src/decorator/class/Graph';
import { GraphBranch } from '../../../src/decorator/property/GraphBranch';
import { GraphNode } from '../../../src/decorator/property/GraphNode';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity()
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@NodeEntity()
class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('shop-:HAS->item')
class ShopItem {
  @GraphNode()
  private shop: Shop;

  @GraphNode()
  private item: Item;

  constructor(shop: Shop, item: Item) {
    this.shop = shop;
    this.item = item;
  }
}

@Graph('shop')
class ShopItems {
  @GraphNode()
  private shop: Shop;

  @GraphBranch(Item, 'shop-:HAS->*')
  private items: Item[];

  constructor(shop: Shop, items: Item[]) {
    this.shop = shop;
    this.items = items;
  }
}

const id = new IdFixture();
let neo4jFixture: Neo4jFixture | null = null;
let qb: QueryBuilder | null = null;

describe('DetachDelete graph', () => {
  beforeEach(async () => {
    neo4jFixture = Neo4jFixture.new();
    qb = new QueryBuilder(neo4jFixture.getDriver());

    await neo4jFixture.addRelationship(
      'HAS',
      { id: id.get('has1') },
      await neo4jFixture.addNode('Shop', { id: id.get('shop') }),
      await neo4jFixture.addNode('Item', { id: id.get('item1') }),
      '->'
    );

    await neo4jFixture.addRelationship(
      'HAS',
      { id: id.get('has2') },
      await neo4jFixture.addNode('Shop', { id: id.get('shop') }),
      await neo4jFixture.addNode('Item', { id: id.get('item2') }),
      '->'
    );
  });

  afterEach(async () => {
    await neo4jFixture.teardown();
  });

  test('detach and delete', async () => {
    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item1'));
    const shopItem = new ShopItem(shop, item);

    const query = qb.detachDelete(shopItem);

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop{id:$n0.id}) ' +
        'MATCH (n4:Item{id:$n4.id}) ' +
        'CALL {WITH n0,n4 DETACH DELETE n0 DETACH DELETE n4} IN TRANSACTIONS'
    );
    await query.run();

    expect(await neo4jFixture.findNode('Shop', id.get('shop'))).toBeNull();
    expect(
      await neo4jFixture.findRelationship('HAS', id.get('has1'))
    ).toBeNull();
    expect(await neo4jFixture.findNode('Item', id.get('item1'))).toBeNull();
  });

  test('detach and delete branches', async () => {
    const shopItems = new ShopItems(new Shop(id.get('shop')), [
      new Item(id.get('item1')),
      new Item(id.get('item2')),
    ]);

    const query = qb.detachDelete(shopItems);

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop{id:$n0.id}) ' +
        'MATCH (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MATCH (b0_1_n4:Item{id:$b0_1_n4.id}) ' +
        'CALL {' +
        'WITH n0,b0_0_n4,b0_1_n4 ' +
        'DETACH DELETE n0 ' +
        'DETACH DELETE b0_0_n4 ' +
        'DETACH DELETE b0_1_n4} IN TRANSACTIONS'
    );
    await query.run();

    expect(await neo4jFixture.findNode('Shop', id.get('shop'))).toBeNull();
    expect(await neo4jFixture.findNode('Item', id.get('item1'))).toBeNull();
    expect(await neo4jFixture.findNode('Item', id.get('item2'))).toBeNull();

    expect(
      await neo4jFixture.findRelationship('HAS', id.get('has1'))
    ).toBeNull();
    expect(
      await neo4jFixture.findRelationship('HAS', id.get('has2'))
    ).toBeNull();
  });
});
