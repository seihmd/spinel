import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import {
  HasStock,
  ID,
  Item,
  ItemInfo,
  Shop,
  ShopInfo,
  ShopItem,
  ShopItems,
} from './fixture';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find having Embeddable', () => {
  const arrival = new Date('2023-01-01');

  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
      shop_brand: 'ShopName',
      shop_address: 'address',
    });

    const item = await neo4jFixture.addNode('Item', {
      id: id.get('item'),
      stock: 1,
      arrival: arrival,
    });

    await neo4jFixture.addRelationship(
      'HAS_STOCK',
      { id: id.get('hasStock') },
      shop,
      item,
      '->'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test('find nodes', async () => {
    const shops = await qd
      .builder()
      .find(Shop)
      .where('shop.id.value = $shopId')
      .buildQuery({
        shopId: id.get('shop'),
      })
      .run();

    expect(shops).toStrictEqual([
      new Shop(new ID(id.get('shop')), new ShopInfo('ShopName', 'address')),
    ]);
  });

  test('find where', async () => {
    const shops = await qd
      .builder()
      .find(Shop)
      .where('shop.id.value = $shopId AND shop.info.address IS NOT NULL')
      .buildQuery({
        shopId: id.get('shop'),
      })
      .run();

    expect(shops).toStrictEqual([
      new Shop(new ID(id.get('shop')), new ShopInfo('ShopName', 'address')),
    ]);
  });

  test('find graphs', async () => {
    const q = qd
      .builder()
      .find(ShopItem)
      .where('shop.id.value = $shopId')
      .buildQuery({
        shopId: id.get('shop'),
      });

    expect(q.getStatement()).toBe(
      'MATCH (n0:Shop)-[r2:HAS_STOCK]->(n4:Item) ' +
        'WHERE n0.id = $shopId ' +
        'RETURN {shop:n0{.*},hasStock:r2{.*},item:n4{.*}} AS _'
    );

    expect(await q.run()).toStrictEqual([
      new ShopItem(
        new Shop(new ID(id.get('shop')), new ShopInfo('ShopName', 'address')),
        new HasStock(new ID(id.get('hasStock'))),
        new Item(new ID(id.get('item')), new ItemInfo(1, arrival))
      ),
    ]);
  });

  test('find branched graphs', async () => {
    const q = qd
      .builder()
      .find(ShopItems)
      .where('shop.id.value = $shopId')
      .filterBranch('items', '.info.arrival IS NOT NULL')
      .orderBy('shop.info.address', 'ASC')
      .buildQuery({
        shopId: id.get('shop'),
      });

    expect(q.getStatement()).toBe(
      '' +
        'MATCH (n0:Shop) ' +
        'WHERE n0.id = $shopId ' +
        'RETURN {shop:n0{.*},' +
        'items:[(n0)-[b0_r2:HAS_STOCK]->(b0_n4:Item) ' +
        'WHERE b0_n4.arrival IS NOT NULL|b0_n4{.*}]} AS _ ' +
        'ORDER BY n0.shop_address ASC'
    );

    // await q.run();
    expect(await q.run()).toStrictEqual([
      new ShopItems(
        new Shop(new ID(id.get('shop')), new ShopInfo('ShopName', 'address')),
        [new Item(new ID(id.get('item')), new ItemInfo(1, arrival))]
      ),
    ]);
  });
});
