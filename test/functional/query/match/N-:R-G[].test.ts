import 'reflect-metadata';
import { WhereQuery } from '../../../../src/query/builder/where/WhereQuery';
import { IdFixture } from '../../fixtures/IdFixture';
import { WhereQueries } from '../../../../src/query/builder/where/WhereQueries';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { QueryBuilder } from '../../../../src/query/builder/match/QueryBuilder';
import { QueryPlan } from '../../../../src/query/builder/match/QueryPlan';
import { Depth } from '../../../../src/domain/graph/branch/Depth';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Graph } from '../../../../src/decorator/class/Graph';
import { Primary } from '../../../../src/decorator/property/Primary';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { GraphBranch } from '../../../../src/decorator/property/GraphBranch';

const neo4jFixture = Neo4jFixture.new();

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

@NodeEntity()
class Tag {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('item')
class ItemTags {
  @GraphNode() private item: Item;
  @GraphBranch(Tag, 'item-:HAS_TAG->*') private tags: Tag[];

  constructor(item: Item, tags: Tag[]) {
    this.item = item;
    this.tags = tags;
  }
}

@Graph('shop')
class ShopItemTags {
  @GraphNode() private shop: Shop;
  @GraphBranch(ItemTags, 'shop-:HAS_STOCK->*.item')
  private itemTags: ItemTags[];

  constructor(shop: Shop, itemTags: ItemTags[]) {
    this.shop = shop;
    this.itemTags = itemTags;
  }
}

const id = new IdFixture();

describe('map Neo4j Record into N-:R-G[] Graph class', () => {
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
  });

  test('QueryBuilder', () => {
    const queryBuilder = QueryBuilder.new();
    const query = queryBuilder.build(
      ShopItemTags,
      new WhereQueries([]),
      new Depth(3)
    );
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop) ' +
      'RETURN {shop:n0{.*},' +
      'itemTags:[(n0)-[b0_r2:HAS_STOCK]->(b0_n4:Item)|{item:b0_n4{.*},' +
      'tags:[(b0_n4)-[b0_b0_r2:HAS_TAG]->(b0_b0_n4:Tag)|b0_b0_n4{.*}]}]} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(
      ShopItemTags,
      {
        whereQueries: new WhereQueries([new WhereQuery(null, '{shop}.id = $shopId')]),
        parameters: { shopId: id.get('shop') }
      }
    );
    expect(results).toStrictEqual([
      new ShopItemTags(new Shop(id.get('shop')), [
        new ItemTags(new Item(id.get('item')), [
          new Tag(id.get('tag2')),
          new Tag(id.get('tag1')),
        ]),
      ]),
    ]);
  });
});