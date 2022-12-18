import { Graph } from 'decorator/class/Graph';
import { GraphFragment } from 'decorator/class/GraphFragment';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
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

@GraphFragment('-:HAS_FAVORITE@hasFavorite->item')
class FavoriteItem {
  @GraphNode() private item: Item;

  constructor(item: Item) {
    this.item = item;
  }
}

@Graph('shop')
class ShopCustomerFavorites {
  @GraphNode() private shop: Shop;
  @GraphBranch(FavoriteItem, 'shop<-:IS_CUSTOMER-:Customer@customer')
  private favoriteItems: FavoriteItem[];

  constructor(shop: Shop, favoriteItems: FavoriteItem[]) {
    this.shop = shop;
    this.favoriteItems = favoriteItems;
  }
}

const id = new IdFixture();
const neo4jFixture = Neo4jFixture.new();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find N-F[] graphs', () => {
  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', { id: id.get('shop') });
    const customer = await neo4jFixture.addNode('Customer', {
      id: id.get('customer'),
    });
    const item = await neo4jFixture.addNode('Item', { id: id.get('item1') });
    const item2 = await neo4jFixture.addNode('Item', { id: id.get('item2') });

    await neo4jFixture.addRelationship('IS_CUSTOMER', {}, shop, customer, '<-');
    await neo4jFixture.addRelationship(
      'HAS_FAVORITE',
      {},
      customer,
      item,
      '->'
    );
    await neo4jFixture.addRelationship(
      'HAS_FAVORITE',
      {},
      customer,
      item2,
      '->'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test('find', async () => {
    const query = qd
      .builder()
      .find(ShopCustomerFavorites, 'scf')
      .where('{shop}.id=$shop.id')
      .buildQuery({
        shop: { id: id.get('shop') },
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop) ' +
        'WHERE n0.id=$shop.id ' +
        'RETURN {shop:n0{.*},' +
        'favoriteItems:[(n0)<-[b0_r2:IS_CUSTOMER]-(b0_n4:Customer)-[b0_r6:HAS_FAVORITE]->(b0_n8:Item)' +
        '|{item:b0_n8{.*}}]} AS _'
    );
    expect(await query.run()).toStrictEqual([
      new ShopCustomerFavorites(new Shop(id.get('shop')), [
        new FavoriteItem(new Item(id.get('item2'))),
        new FavoriteItem(new Item(id.get('item1'))),
      ]),
    ]);
  });

  test('find with branch where', async () => {
    const query = qd
      .builder()
      .find(ShopCustomerFavorites, 'scf')
      .where('{shop}.id=$shop.id')
      .filterBranch('favoriteItems', '{@.item}.id=$item.id')
      .buildQuery({
        shop: { id: id.get('shop') },
        item: { id: id.get('item1') },
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop) ' +
        'WHERE n0.id=$shop.id ' +
        'RETURN {shop:n0{.*},' +
        'favoriteItems:[(n0)<-[b0_r2:IS_CUSTOMER]-(b0_n4:Customer)-[b0_r6:HAS_FAVORITE]->(b0_n8:Item) ' +
        'WHERE b0_n8.id=$item.id|{item:b0_n8{.*}}]} ' +
        'AS _'
    );
    expect(await query.run()).toStrictEqual([
      new ShopCustomerFavorites(new Shop(id.get('shop')), [
        new FavoriteItem(new Item(id.get('item1'))),
      ]),
    ]);
  });
});
