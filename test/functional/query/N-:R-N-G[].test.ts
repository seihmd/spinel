import 'reflect-metadata';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import { NodeEntity } from '../../../src/decorator/class/NodeEntity';
import { Primary } from '../../../src/decorator/property/Primary';
import { RelationshipEntity } from '../../../src/decorator/class/RelationshipEntity';
import { GraphNode } from '../../../src/decorator/property/GraphNode';
import { Graph } from '../../../src/decorator/class/Graph';
import { QueryPlan } from '../../../src/query/builder/QueryPlan';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { GraphParameter } from '../../../src/query/parameter/GraphParameter';
import { StemBuilder } from '../../../src/query/builder/StemBuilder';
import { getMetadataStore } from '../../../src/metadata/store/MetadataStore';
import { GraphBranch } from '../../../src/decorator/property/GraphBranch';
import { Depth } from '../../../src/domain/graph/branch/Depth';
import { IdFixture } from '../fixtures/IdFixture';
import { WhereQueries } from '../../../src/query/builder/where/WhereQueries';

const neo4jFixture = Neo4jFixture.new();

@NodeEntity()
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@NodeEntity({ label: 'Customer' })
class User {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@RelationshipEntity()
class IsCustomer {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@NodeEntity()
export class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('item')
class SimilarItems {
  @GraphNode() private item: Item;
  @GraphBranch(Item, 'item<-:IS_SIMILAR-*') private similarities: Item[];

  constructor(item: Item, similarities: Item[]) {
    this.item = item;
    this.similarities = similarities;
  }
}

@Graph('shop<-:IS_CUSTOMER-customer')
class ShopCustomer {
  @GraphNode() private shop: Shop;
  @GraphNode() private customer: User;
  @GraphBranch(SimilarItems, 'customer-:HAS_FAVORITE->*.item')
  private favoriteSimilarities: SimilarItems[];
  @GraphBranch(Shop, 'shop-:HAS_NEIGHBORHOOD->*')
  private neighborhoodShops: Shop[];

  constructor(
    shop: Shop,
    customer: User,
    favoriteSimilarities: SimilarItems[],
    neighborhoodShops: Shop[]
  ) {
    this.shop = shop;
    this.customer = customer;
    this.favoriteSimilarities = favoriteSimilarities;
    this.neighborhoodShops = neighborhoodShops;
  }
}

const id = new IdFixture();

describe('map Neo4j Record into N-:R-N-G[] Graph class', () => {
  beforeAll(async () => {
    const item = await neo4jFixture.addNode('Item', { id: id.get('item') });
    const similarItem1 = await neo4jFixture.addNode('Item', {
      id: id.get('similarItem1'),
    });
    const similarItem2 = await neo4jFixture.addNode('Item', {
      id: id.get('similarItem2'),
    });

    const shop = await neo4jFixture.addNode('Shop', { id: id.get('shop') });
    const neighborhoodShop1 = await neo4jFixture.addNode('Shop', {
      id: id.get('neighborhoodShop1'),
    });
    const neighborhoodShop2 = await neo4jFixture.addNode('Shop', {
      id: id.get('neighborhoodShop2'),
    });
    const customer = await neo4jFixture.addNode('Customer', {
      id: id.get('customer'),
    });

    await neo4jFixture.addRelationship('IS_CUSTOMER', {}, shop, customer, '<-');
    await neo4jFixture.addRelationship(
      'HAS_FAVORITE',
      {},
      customer,
      item,
      '->'
    );
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      item,
      similarItem1,
      '<-'
    );
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      item,
      similarItem2,
      '<-'
    );
    await neo4jFixture.addRelationship(
      'HAS_NEIGHBORHOOD',
      {},
      shop,
      neighborhoodShop1,
      '->'
    );
    await neo4jFixture.addRelationship(
      'HAS_NEIGHBORHOOD',
      {},
      shop,
      neighborhoodShop2,
      '->'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('QueryBuilder', () => {
    const stemBuilder = new StemBuilder(getMetadataStore());
    const queryBuilder = new QueryBuilder(stemBuilder);
    const query = queryBuilder.build(
      ShopCustomer,
      new WhereQueries([]),
      new GraphParameter('', {})
    );
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'RETURN {shop:n0{.*},customer:n4{.*},' +
        'favoriteSimilarities:[(n4)-[b0_r2:HAS_FAVORITE]->(b0_n4:Item)|{item:b0_n4{.*},' +
        'similarities:[(b0_n4)<-[b0_b0_r2:IS_SIMILAR]-(b0_b0_n4:Item)|b0_b0_n4{.*}]}],' +
        'neighborhoodShops:[(n0)-[b1_r2:HAS_NEIGHBORHOOD]->(b1_n4:Shop)|b1_n4{.*}]} ' +
        'AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(
      ShopCustomer,
      new WhereQueries([]),
      { shop: { id: id.get('shop') } },
      new Depth(2)
    );
    expect(results).toStrictEqual([
      new ShopCustomer(
        new Shop(id.get('shop')),
        new User(id.get('customer')),
        [
          new SimilarItems(new Item(id.get('item')), [
            new Item(id.get('similarItem2')),
            new Item(id.get('similarItem1')),
          ]),
        ],
        [
          new Shop(id.get('neighborhoodShop2')),
          new Shop(id.get('neighborhoodShop1')),
        ]
      ),
    ]);
  });
});
