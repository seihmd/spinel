import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Graph } from '../../../../src/decorator/class/Graph';
import { IdFixture } from '../../fixtures/IdFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { RelationshipEntity } from '../../../../src/decorator/class/RelationshipEntity';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { GraphBranch } from '../../../../src/decorator/property/GraphBranch';
import { SaveQueryBuilder } from '../../../../src/query/builder/save/SaveQueryBuilder';

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

describe('save N-:R-N-G[] Graph class', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test.each([
    [
      [],
      [],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n4:Customer{id:$n4.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER]-(n4) ' +
        'SET n0=$n0 ' +
        'SET n4=$n4',
    ],
    [
      [new SimilarItems(new Item('item1'), [])],
      [],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n4:Customer{id:$n4.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER]-(n4) ' +
        'MERGE (n4)-[b0_0_r2:HAS_FAVORITE]->(b0_0_n4) SET n0=$n0 SET n4=$n4 SET b0_0_n4=$b0_0_n4',
    ],
    [
      [new SimilarItems(new Item('item1'), [new Item('similar1')])],
      [],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n4:Customer{id:$n4.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (b0_0_b0_0_n4:Item{id:$b0_0_b0_0_n4.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER]-(n4) ' +
        'MERGE (n4)-[b0_0_r2:HAS_FAVORITE]->(b0_0_n4) ' +
        'MERGE (b0_0_n4)<-[b0_0_b0_0_r2:IS_SIMILAR]-(b0_0_b0_0_n4) ' +
        'SET n0=$n0 ' +
        'SET n4=$n4 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_0_b0_0_n4=$b0_0_b0_0_n4',
    ],
    [
      [],
      [new Shop(id.get('shop1'))],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n4:Customer{id:$n4.id}) ' +
        'MERGE (b1_0_n4:Shop{id:$b1_0_n4.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER]-(n4) ' +
        'MERGE (n0)-[b1_0_r2:HAS_NEIGHBORHOOD]->(b1_0_n4) ' +
        'SET n0=$n0 ' +
        'SET n4=$n4 ' +
        'SET b1_0_n4=$b1_0_n4',
    ],
    [
      [
        new SimilarItems(new Item('item1'), [
          new Item('similar1'),
          new Item('similar2'),
        ]),
      ],
      [new Shop(id.get('shop1')), new Shop(id.get('shop2'))],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n4:Customer{id:$n4.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (b0_0_b0_0_n4:Item{id:$b0_0_b0_0_n4.id}) ' +
        'MERGE (b0_0_b0_1_n4:Item{id:$b0_0_b0_1_n4.id}) ' +
        'MERGE (b1_0_n4:Shop{id:$b1_0_n4.id}) ' +
        'MERGE (b1_1_n4:Shop{id:$b1_1_n4.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER]-(n4) ' +
        'MERGE (n4)-[b0_0_r2:HAS_FAVORITE]->(b0_0_n4) ' +
        'MERGE (b0_0_n4)<-[b0_0_b0_0_r2:IS_SIMILAR]-(b0_0_b0_0_n4) ' +
        'MERGE (b0_0_n4)<-[b0_0_b0_1_r2:IS_SIMILAR]-(b0_0_b0_1_n4) ' +
        'MERGE (n0)-[b1_0_r2:HAS_NEIGHBORHOOD]->(b1_0_n4) ' +
        'MERGE (n0)-[b1_1_r2:HAS_NEIGHBORHOOD]->(b1_1_n4) ' +
        'SET n0=$n0 ' +
        'SET n4=$n4 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_0_b0_0_n4=$b0_0_b0_0_n4 ' +
        'SET b0_0_b0_1_n4=$b0_0_b0_1_n4 ' +
        'SET b1_0_n4=$b1_0_n4 ' +
        'SET b1_1_n4=$b1_1_n4',
    ],
  ])(
    'SaveQueryBuilder',
    (
      favoriteSimilarities: SimilarItems[],
      neighborhoodShops: Shop[],
      expected: string
    ) => {
      const queryBuilder = SaveQueryBuilder.new();
      const shopCustomer = new ShopCustomer(
        new Shop(id.get('shop')),
        new User(id.get('user')),
        favoriteSimilarities,
        neighborhoodShops
      );
      const [query] = queryBuilder.build(shopCustomer);
      expect(query.get()).toBe(expected);
    }
  );
});
