import 'reflect-metadata';
import { WhereQuery } from '../../../../src/query/builder/where/WhereQuery';
import { IdFixture } from '../../fixtures/IdFixture';
import { WhereQueries } from '../../../../src/query/builder/where/WhereQueries';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { QueryBuilder } from '../../../../src/query/builder/match/QueryBuilder';
import { QueryPlan } from '../../../../src/query/builder/match/QueryPlan';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Graph } from '../../../../src/decorator/class/Graph';
import { Primary } from '../../../../src/decorator/property/Primary';
import { GraphFragment } from '../../../../src/decorator/class/GraphFragment';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { GraphBranch } from '../../../../src/decorator/property/GraphBranch';
import { OrderByQueries } from '../../../../src/query/builder/orderBy/OrderByQueries';

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

describe('map Neo4j Record into N-F[] Graph class', () => {
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
  });

  const whereQueries = new WhereQueries([
    new WhereQuery(
      'favoriteItems',
      '{shop}.id=$shop.id AND ({customer}) AND [{*.hasFavorite}] AND ({*.item})'
    ),
  ]);

  test('QueryBuilder', () => {
    const queryBuilder = QueryBuilder.new();
    const query = queryBuilder.build(
      ShopCustomerFavorites,
      whereQueries,
      new OrderByQueries([])
    );
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop) ' +
        'RETURN {shop:n0{.*},' +
        'favoriteItems:[(n0)<-[b0_r2:IS_CUSTOMER]-(b0_n4:Customer)-[b0_r6:HAS_FAVORITE]->(b0_n8:Item) ' +
        'WHERE n0.id=$shop.id AND (b0_n4) AND [b0_r6] AND (b0_n8)' +
        '|{item:b0_n8{.*}}]} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(ShopCustomerFavorites, {
      whereQueries: new WhereQueries([
        new WhereQuery(null, '{shop}.id=$shop.id'),
      ]),
      parameters: {
        shop: { id: id.get('shop') },
      },
    });
    expect(results).toStrictEqual([
      new ShopCustomerFavorites(new Shop(id.get('shop')), [
        new FavoriteItem(new Item(id.get('item2'))),
        new FavoriteItem(new Item(id.get('item1'))),
      ]),
    ]);
  });
});
