import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();

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

@NodeEntity('Tag')
class Tag {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('item')
class ItemTags {
  @GraphNode() private item: Item;

  @GraphBranch(Tag, 'item-[hasTag:HAS_TAG]->.')
  private tags: Tag[];

  constructor(item: Item, tags: Tag[]) {
    this.item = item;
    this.tags = tags;
  }
}

@Graph('shop')
class ShopItemTags {
  @GraphNode() private shop: Shop;

  @GraphBranch(ItemTags, 'shop-[hasStock:HAS_STOCK]->.item')
  private itemTags: ItemTags[];

  constructor(shop: Shop, itemTags: ItemTags[]) {
    this.shop = shop;
    this.itemTags = itemTags;
  }
}

const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find N-:R-G[] graphs', () => {
  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', { id: id.get('shop') });
    const item = await neo4jFixture.addNode('Item', { id: id.get('item') });
    const tag1 = await neo4jFixture.addNode('Tag', { id: id.get('tag1') });
    const tag2 = await neo4jFixture.addNode('Tag', { id: id.get('tag2') });

    await neo4jFixture.addRelationship('HAS_STOCK', {}, shop, item, '->');
    await neo4jFixture.addRelationship('HAS_TAG', {}, item, tag1, '->');
    await neo4jFixture.addRelationship('HAS_TAG', {}, item, tag2, '->');
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test('find', async () => {
    const query = qd
      .builder()
      .find(ShopItemTags)
      .where('shop.id = $shopId')
      .buildQuery({ shopId: id.get('shop') });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop) ' +
        'WHERE n0.id = $shopId ' +
        'RETURN {shop:n0{.*},' +
        'itemTags:[(n0)-[b0_r2:HAS_STOCK]->(b0_n4:Item)|{item:b0_n4{.*},' +
        'tags:[(b0_n4)-[b0_b0_r2:HAS_TAG]->(b0_b0_n4:Tag)|b0_b0_n4{.*}]}]} ' +
        'AS _'
    );

    expect(await query.run()).toStrictEqual([
      new ShopItemTags(new Shop(id.get('shop')), [
        new ItemTags(new Item(id.get('item')), [
          new Tag(id.get('tag2')),
          new Tag(id.get('tag1')),
        ]),
      ]),
    ]);
  });

  test('find with branch where', async () => {
    const query = qd
      .builder()
      .find(ShopItemTags)
      .where('shop.id=$shop.id')
      .filterBranch(
        'itemTags',
        'shop.id=$shop.id AND NOT isEmpty([hasStock]) AND .item.id=$itemId'
      )
      .filterBranch('itemTags.tags', '.id=$tagId AND NOT isEmpty([hasTag])')
      .buildQuery({
        shop: { id: id.get('shop') },
        itemId: id.get('item'),
        tagId: id.get('tag1'),
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop) ' +
        'WHERE n0.id=$shop.id ' +
        'RETURN {shop:n0{.*},itemTags:[(n0)-[b0_r2:HAS_STOCK]->(b0_n4:Item) ' +
        'WHERE n0.id=$shop.id AND NOT isEmpty([b0_r2]) AND b0_n4.id=$itemId|{item:b0_n4{.*},' +
        'tags:[(b0_n4)-[b0_b0_r2:HAS_TAG]->(b0_b0_n4:Tag) ' +
        'WHERE b0_b0_n4.id=$tagId AND NOT isEmpty([b0_b0_r2])|b0_b0_n4{.*}]}]} ' +
        'AS _'
    );
    expect(await query.run()).toStrictEqual([
      new ShopItemTags(new Shop(id.get('shop')), [
        new ItemTags(new Item(id.get('item')), [new Tag(id.get('tag1'))]),
      ]),
    ]);
  });
});
