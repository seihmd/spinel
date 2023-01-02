import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import 'reflect-metadata';
import {
  Graph,
  GraphNode,
  GraphRelationship,
  RelationshipEntity,
} from '../../../src';
import { Embeddable } from '../../../src/decorator/class/Embeddable';
import { Embed } from '../../../src/decorator/property/Embed';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@Embeddable()
class ID {
  constructor(value: string) {
    this.id = value;
  }

  @Primary()
  private readonly id: string;
}

@NodeEntity()
class Shop {
  @Embed()
  id: ID;

  @Property()
  name: string;

  constructor(id: ID, name: string) {
    this.id = id;
    this.name = name;
  }
}

@Embeddable()
class ItemInfo {
  @Property()
  stock: number;

  @Property()
  arrival: Date;

  constructor(stock: number, arrival: Date) {
    this.stock = stock;
    this.arrival = arrival;
  }
}

@NodeEntity()
class Item {
  @Embed()
  id: ID;

  @Embed()
  info: ItemInfo;

  constructor(id: ID, info: ItemInfo) {
    this.id = id;
    this.info = info;
  }
}

@RelationshipEntity()
class HasStock {
  @Embed()
  id: ID;

  constructor(id: ID) {
    this.id = id;
  }
}

@Graph('shop-hasStock->item')
class ShopItem {
  @GraphNode()
  private shop: Shop;

  @GraphRelationship()
  private hasStock: HasStock;

  @GraphNode()
  private item: Item;

  constructor(shop: Shop, hasStock: HasStock, item: Item) {
    this.shop = shop;
    this.hasStock = hasStock;
    this.item = item;
  }
}

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find having Embeddable', () => {
  const arrival = new Date('2023-01-01');

  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
      name: 'ShopName',
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

    expect(shops).toStrictEqual([new Shop(new ID(id.get('shop')), 'ShopName')]);
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
        new Shop(new ID(id.get('shop')), 'ShopName'),
        new HasStock(new ID(id.get('hasStock'))),
        new Item(new ID(id.get('item')), new ItemInfo(1, arrival))
      ),
    ]);
  });
});
