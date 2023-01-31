import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity('Shop')
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@NodeEntity('Item')
class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('shop-[:HAS_STOCK]->(:Item)')
class ShopHavingStock {
  @GraphNode()
  private shop: Shop;

  constructor(shop: Shop) {
    this.shop = shop;
  }
}

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find N-:R-:N graphs', () => {
  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', { id: id.get('shop') });
    const item = await neo4jFixture.addNode('Item', { id: id.get('item') });

    const shop2 = await neo4jFixture.addNode('Shop', {
      id: id.get('shopNoStock'),
    });

    await neo4jFixture.addRelationship('HAS_STOCK', {}, shop, item, '->');
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test('find', async () => {
    const query = qd
      .builder()
      .find(ShopHavingStock)
      .where('shop.id = $shopId')
      .buildQuery({ shopId: id.get('shop') });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop)-[r2:HAS_STOCK]->(n4:Item) ' +
        'WHERE n0.id = $shopId ' +
        'RETURN {shop:n0{.*}} AS _'
    );

    expect(await query.run()).toStrictEqual([
      new ShopHavingStock(new Shop(id.get('shop'))),
    ]);
  });
});
