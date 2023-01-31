import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { GraphRelationship } from 'decorator/property/GraphRelationship';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { Integer } from 'neo4j-driver';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity('Shop')
class Shop {
  @Primary() private id: string;
  @Property() private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

@NodeEntity('Customer')
class User {
  @Primary() private id: string;
  @Property() private age: number;

  constructor(id: string, age: number) {
    this.id = id;
    this.age = age;
  }
}

@RelationshipEntity('IS_CUSTOMER')
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
const neo4jFixture = Neo4jFixture.new();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('save N-R-N graph', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test('save', async () => {
    const shopCustomer = new ShopCustomer(
      new Shop(id.get('shop'), 'shop_name'),
      new IsCustomer(id.get('isCustomer'), '2022-01-01'),
      new User(id.get('user'), 20)
    );
    const query = qd.builder().save(shopCustomer);
    expect(query.getStatement()).toBe(
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n4:Customer{id:$n4.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER{id:$r2.id}]-(n4) ' +
        'SET n0=$n0 ' +
        'SET n4=$n4 ' +
        'SET r2=$r2'
    );

    await query.run();
    const savedValue = await neo4jFixture.findGraph(
      `MATCH (shop:Shop{id:"${id.get(
        'shop'
      )}"})<-[isCustomer:IS_CUSTOMER{id:"${id.get(
        'isCustomer'
      )}"}]-(user:Customer{id:"${id.get(
        'user'
      )}"}) RETURN shop, isCustomer, user`
    );

    expect(savedValue).toStrictEqual({
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
