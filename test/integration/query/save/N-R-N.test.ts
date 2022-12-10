import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { GraphRelationship } from 'decorator/property/GraphRelationship';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { Integer } from 'neo4j-driver';
import { SaveQueryBuilder } from 'query/builder/save/SaveQueryBuilder';
import { SaveQueryPlan } from 'query/builder/save/SaveQueryPlan';
import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();

@NodeEntity()
class Shop {
  @Primary() private id: string;
  @Property() private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

@NodeEntity({ label: 'Customer' })
class User {
  @Primary() private id: string;
  @Property() private age: number;

  constructor(id: string, age: number) {
    this.id = id;
    this.age = age;
  }
}

@RelationshipEntity()
class IsCustomer {
  @Primary() private id: string;
  @Property() private visited: string;

  constructor(id: string, visited: string) {
    this.id = id;
    this.visited = visited;
  }
}

@Graph('shop<-isCustomer-customer')
class ShopCustomer {
  @GraphNode() private shop: Shop;
  @GraphRelationship() private isCustomer: IsCustomer;
  @GraphNode() private customer: User;

  constructor(shop: Shop, isCustomer: IsCustomer, customer: User) {
    this.shop = shop;
    this.isCustomer = isCustomer;
    this.customer = customer;
  }
}

const id = new IdFixture();

describe('save N-R-N Graph class', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('SaveQueryBuilder', () => {
    const queryBuilder = SaveQueryBuilder.new();

    const shopCustomer = new ShopCustomer(
      new Shop(id.get('shop'), 'shop_name'),
      new IsCustomer(id.get('isCustomer'), '2022-01-01'),
      new User(id.get('user'), 20)
    );
    const [query] = queryBuilder.build(shopCustomer);
    expect(query.get()).toBe(
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n4:Customer{id:$n4.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER{id:$r2.id}]-(n4) ' +
        'SET n0=$n0 ' +
        'SET n4=$n4 ' +
        'SET r2=$r2'
    );
  });

  test('SaveQueryPlan', async () => {
    const saveQueryPlan = SaveQueryPlan.new(neo4jFixture.getDriver());
    const shopCustomer = new ShopCustomer(
      new Shop(id.get('shop'), 'shop_name'),
      new IsCustomer(id.get('isCustomer'), '2022-01-01'),
      new User(id.get('user'), 20)
    );
    await saveQueryPlan.execute(shopCustomer);

    const saved = await neo4jFixture.findGraph(
      `MATCH (shop:Shop{id:"${id.get(
        'shop'
      )}"})<-[isCustomer:IS_CUSTOMER{id:"${id.get(
        'isCustomer'
      )}"}]-(user:Customer{id:"${id.get(
        'user'
      )}"}) RETURN shop, isCustomer, user`
    );

    expect(saved).toStrictEqual({
      shop: {
        id: id.get('shop'),
        name: 'shop_name',
      },
      isCustomer: {
        id: id.get('isCustomer'),
        visited: '2022-01-01',
      },
      user: {
        id: id.get('user'),
        age: Integer.fromValue(20),
      },
    });
  });
});
