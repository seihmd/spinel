import { Graph } from 'decorator/class/Graph';
import { GraphFragment } from 'decorator/class/GraphFragment';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { GraphRelationship } from 'decorator/property/GraphRelationship';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity()
class User {
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

@RelationshipEntity()
class HasFavorite {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@GraphFragment('-hasFavorite->item')
class FavoriteItem {
  @GraphNode() private item: Item;
  @GraphRelationship() private hasFavorite: HasFavorite;

  constructor(item: Item, hasFavorite: HasFavorite) {
    this.item = item;
    this.hasFavorite = hasFavorite;
  }
}

@Graph('customer')
class CustomerFavorites {
  @GraphNode() private customer: User;
  @GraphBranch(FavoriteItem, 'customer')
  private favoriteItems: FavoriteItem[];

  constructor(customer: User, favoriteItems: FavoriteItem[]) {
    this.customer = customer;
    this.favoriteItems = favoriteItems;
  }
}

const id = new IdFixture();
const neo4jFixture = Neo4jFixture.new();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Save N-F[] graph', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });
  test.each([
    [[], 'MERGE (n0:User{id:$n0.id}) SET n0=$n0'],
    [
      [
        new FavoriteItem(
          new Item(id.get('item1')),
          new HasFavorite(id.get('hasFavorite1'))
        ),
      ],

      'MERGE (n0:User{id:$n0.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (n0)-[b0_0_r2:HAS_FAVORITE{id:$b0_0_r2.id}]->(b0_0_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_0_r2=$b0_0_r2',
    ],
    [
      [
        new FavoriteItem(
          new Item(id.get('item1')),
          new HasFavorite(id.get('hasFavorite1'))
        ),
        new FavoriteItem(
          new Item(id.get('item2')),
          new HasFavorite(id.get('hasFavorite2'))
        ),
      ],

      'MERGE (n0:User{id:$n0.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (b0_1_n4:Item{id:$b0_1_n4.id}) ' +
        'MERGE (n0)-[b0_0_r2:HAS_FAVORITE{id:$b0_0_r2.id}]->(b0_0_n4) ' +
        'MERGE (n0)-[b0_1_r2:HAS_FAVORITE{id:$b0_1_r2.id}]->(b0_1_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_0_r2=$b0_0_r2 ' +
        'SET b0_1_n4=$b0_1_n4 ' +
        'SET b0_1_r2=$b0_1_r2',
    ],
  ])('statement', (favoriteItems: FavoriteItem[], expected: string) => {
    const customerFavorites = new CustomerFavorites(
      new User(id.get('user')),
      favoriteItems
    );
    const query = qd.builder().save(customerFavorites);
    expect(query.getStatement()).toBe(expected);
  });

  test('save', async () => {
    const customerFavorites = new CustomerFavorites(new User(id.get('user')), [
      new FavoriteItem(
        new Item(id.get('item1')),
        new HasFavorite(id.get('hasFavorite1'))
      ),
      new FavoriteItem(
        new Item(id.get('item2')),
        new HasFavorite(id.get('hasFavorite2'))
      ),
    ]);
    await qd.builder().save(customerFavorites).run();

    const saved = await neo4jFixture.findGraph(
      `MATCH (user:User{id:"${id.get('user')}"})
      MATCH (user)-[hasFavorite1:HAS_FAVORITE{id:"${id.get(
        'hasFavorite1'
      )}"}]->(item1:Item{id:"${id.get('item1')}"})
      MATCH (user)-[hasFavorite2:HAS_FAVORITE{id:"${id.get(
        'hasFavorite2'
      )}"}]->(item2:Item{id:"${id.get('item2')}"})
      RETURN user, item1, hasFavorite1, item2, hasFavorite2`
    );

    expect(saved).toStrictEqual({
      user: {
        id: id.get('user'),
      },
      hasFavorite1: {
        id: id.get('hasFavorite1'),
      },
      item1: {
        id: id.get('item1'),
      },
      hasFavorite2: {
        id: id.get('hasFavorite2'),
      },
      item2: {
        id: id.get('item2'),
      },
    });
  });
});
