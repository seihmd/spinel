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
const neo4jFixture = Neo4jFixture.new();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('save N-:R-N-G[] graph', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
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
    'statement',
    (
      favoriteSimilarities: SimilarItems[],
      neighborhoodShops: Shop[],
      expected: string
    ) => {
      const shopCustomer = new ShopCustomer(
        new Shop(id.get('shop')),
        new User(id.get('user')),
        favoriteSimilarities,
        neighborhoodShops
      );
      const query = qd.builder().save(shopCustomer);
      expect(query.getStatement()).toBe(expected);
    }
  );

  test('save', async () => {
    const shopCustomer = new ShopCustomer(
      new Shop(id.get('shop')),
      new User(id.get('user')),
      [
        new SimilarItems(new Item(id.get('item')), [
          new Item(id.get('similar1')),
          new Item(id.get('similar2')),
        ]),
      ],
      [new Shop(id.get('shop1')), new Shop(id.get('shop2'))]
    );
    await qd.builder().save(shopCustomer).run();

    expect(
      await neo4jFixture.findGraph(
        `MATCH (shop:Shop{id:"${id.get(
          'shop'
        )}"})<-[isCustomer:IS_CUSTOMER]-(customer:Customer)
      RETURN shop, customer,
      [(shop)-[:HAS_NEIGHBORHOOD]->(neighbor: Shop) | neighbor] as neighbors,
      [(customer)-[:HAS_FAVORITE]->(item:Item) | item] as items`
      )
    ).toStrictEqual({
      shop: {
        id: id.get('shop'),
      },
      customer: {
        id: id.get('user'),
      },
      items: [{ id: id.get('item') }],
      neighbors: [
        {
          id: id.get('shop1'),
        },
        {
          id: id.get('shop2'),
        },
      ].sort((a, b) => (a.id > b.id ? 1 : -1)),
    });

    expect(
      await neo4jFixture.findGraph(
        `MATCH (item:Item{id:"${id.get('item')}"})
      RETURN item, [(item)<-[:IS_SIMILAR]-(similar:Item) | similar] as similars`
      )
    ).toStrictEqual({
      item: { id: id.get('item') },
      similars: [
        {
          id: id.get('similar1'),
        },
        {
          id: id.get('similar2'),
        },
      ].sort((a, b) => (a.id > b.id ? 1 : -1)),
    });
  });
});
