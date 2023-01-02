import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import { HasStock, ID, Item, ItemInfo, Shop, ShopItem } from './fixture';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Save having Embeddable', () => {
  const arrival = new Date('2023-01-01');

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test('save node', async () => {
    const shop = new Shop(new ID(id.get('shop')), 'shopName');
    const query = qd.builder().save(shop);

    expect(query.getStatement()).toBe('MERGE (n0:Shop{id:$n0.id}) SET n0=$n0');

    await query.run();

    const savedValue = await neo4jFixture.findNode('Shop', id.get('shop'));
    expect(savedValue).toStrictEqual({
      id: id.get('shop'),
      name: 'shopName',
    });
  });

  test('save graph', async () => {
    const shopItem = new ShopItem(
      new Shop(new ID(id.get('shop')), 'ShopName'),
      new HasStock(new ID(id.get('hasStock'))),
      new Item(new ID(id.get('item')), new ItemInfo(1, arrival))
    );
    const query = qd.builder().save(shopItem);

    expect(query.getStatement()).toBe(
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n4:Item{id:$n4.id}) ' +
        'MERGE (n0)-[r2:HAS_STOCK{id:$r2.id}]->(n4) ' +
        'SET n0=$n0 ' +
        'SET n4=$n4 ' +
        'SET r2=$r2'
    );

    await query.run();

    const saved = await qd
      .find(ShopItem)
      .where('shop.id = $shopId')
      .buildQuery({ shopId: id.get('shop') })
      .run();

    expect(saved).toStrictEqual([shopItem]);
  });
});
