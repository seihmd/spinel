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
} from './fixture';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find having Embeddable', () => {
  const arrival = new Date('2023-01-01');

  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
      shop_name: 'ShopName',
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
      .where('shop.id = $shopId')
      .buildQuery({
        shopId: id.get('shop'),
      })
      .run();

    expect(shops).toStrictEqual([
      new Shop(new ID(id.get('shop')), new ShopInfo('ShopName', 'address')),
    ]);
  });

  test('find graphs', async () => {
    const shops = await qd
      .builder()
      .find(ShopItem)
      .where('shop.id = $shopId')
      .buildQuery({
        shopId: id.get('shop'),
      })
      .run();

    expect(shops).toStrictEqual([
      new ShopItem(
        new Shop(new ID(id.get('shop')), new ShopInfo('ShopName', 'address')),
        new HasStock(new ID(id.get('hasStock'))),
        new Item(new ID(id.get('item')), new ItemInfo(1, arrival))
      ),
    ]);
  });
});
