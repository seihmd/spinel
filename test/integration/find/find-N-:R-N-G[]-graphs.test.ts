import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

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
class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('item')
class SimilarItems {
  @GraphNode() private item: Item;
  @GraphBranch(Item, 'item<-[:IS_SIMILAR]-.')
  private similarities: Item[];

  constructor(item: Item, similarities: Item[]) {
    this.item = item;
    this.similarities = similarities;
  }
}

@Graph('shop<-[:IS_CUSTOMER]-customer')
class ShopCustomer {
  @GraphNode() private shop: Shop;
  @GraphNode() private customer: User;
  @GraphBranch(SimilarItems, 'customer-[:HAS_FAVORITE]->.item')
  private favoriteSimilarities: SimilarItems[];

  @GraphBranch(Shop, 'shop-[:HAS_NEIGHBORHOOD]->.')
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

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find N-:R-N-G[] graphs', () => {
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
    await neo4jFixture.close();
  });

  test('find', async () => {
    const query = qd
      .builder()
      .find(ShopCustomer)
      .where('shop.id=$shop.id')
      .buildQuery({ shop: { id: id.get('shop') } });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'WHERE n0.id=$shop.id ' +
        'RETURN {shop:n0{.*},customer:n4{.*},' +
        'favoriteSimilarities:[(n4)-[b0_r2:HAS_FAVORITE]->(b0_n4:Item)|{item:b0_n4{.*},' +
        'similarities:[(b0_n4)<-[b0_b0_r2:IS_SIMILAR]-(b0_b0_n4:Item)|b0_b0_n4{.*}]}],' +
        'neighborhoodShops:[(n0)-[b1_r2:HAS_NEIGHBORHOOD]->(b1_n4:Shop)|b1_n4{.*}]} ' +
        'AS _'
    );
    expect(await query.run()).toStrictEqual([
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
