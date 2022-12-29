import {
  Graph,
  GraphNode,
  newRepository,
  NodeEntity,
  Primary,
  Property,
} from '../../../src';
import { FindQuery } from '../../../src/api/query';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import { randomUUID } from 'crypto';

@NodeEntity()
class Shop {
  @Primary() id: string;
  @Property() name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

@Graph('shop-:NEARBY->shop2')
class NearbyShops {
  @GraphNode()
  private shop: Shop;

  @GraphNode()
  private shop2: Shop;

  constructor(shop: Shop, shop2: Shop) {
    this.shop = shop;
    this.shop2 = shop2;
  }
}

const neo4jFixture = Neo4jFixture.new();

async function saveShop(id: string, name: string) {
  await neo4jFixture.addNode('Shop', {
    id,
    name,
  });
}

describe(`SpinelRepository`, () => {
  const repository = newRepository(neo4jFixture.getDriver());

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('find', async () => {
    const id = randomUUID();
    await saveShop(id, 'shopName');

    const shops = await repository.find(
      new FindQuery(Shop).where('{*}.id = $id').parameter('id', id)
    );

    expect(shops).toStrictEqual([new Shop(id, 'shopName')]);
  });

  test('find existing one', async () => {
    const id = randomUUID();
    await saveShop(id, 'shopName');

    const shop = await repository.findOne(
      new FindQuery(Shop).where('{*}.id = $id').parameter('id', id)
    );

    expect(shop).toStrictEqual(new Shop(id, 'shopName'));
  });

  test('not found', async () => {
    const id = randomUUID();

    const shop = await repository.findOne(
      new FindQuery(Shop).where('{*}.id = $id').parameter('id', id)
    );

    expect(shop).toBeNull();
  });

  test('save', async () => {
    const id = randomUUID();
    const shop = new Shop(id, 'shopName');

    await repository.save(shop);

    const savedValue = await neo4jFixture.findNode('Shop', id);
    expect(savedValue).toStrictEqual({
      id,
      name: 'shopName',
    });
  });

  test('delete', async () => {
    const id = randomUUID();
    const shop = new Shop(id, 'shopName');

    await repository.save(shop);
    await repository.delete(shop);

    expect(await neo4jFixture.findNode('Shop', id)).toBeNull();
  });

  test('detach delete', async () => {
    const id = randomUUID();
    const id2 = randomUUID();
    const shop = new Shop(id, 'shopName');
    const shop2 = new Shop(id2, 'shopName2');
    const nearbyShops = new NearbyShops(shop, shop2);

    await repository.save(nearbyShops);
    await repository.detachDelete(shop);

    expect(await neo4jFixture.findNode('Shop', id)).toBeNull();
  });

  test('detach', async () => {
    const id = randomUUID();
    const id2 = randomUUID();
    const shop = new Shop(id, 'shopName');
    const shop2 = new Shop(id2, 'shopName2');
    const nearbyShops = new NearbyShops(shop, shop2);

    await repository.save(nearbyShops);
    await repository.detach(shop, 'NEARBY', shop2, '->');

    expect(await neo4jFixture.findNode('Shop', id)).toStrictEqual({
      id,
      name: 'shopName',
    });
    expect(await neo4jFixture.findNode('Shop', id2)).toStrictEqual({
      id: id2,
      name: 'shopName2',
    });
    expect(
      await neo4jFixture.findGraph(
        `MATCH (n:Shop{id:"${id}"})-[r:NEARBY]->(n2:Shop{id:"${id2}"}) 
        RETURN n, r, n2`
      )
    ).toBeNull();
  });
});
