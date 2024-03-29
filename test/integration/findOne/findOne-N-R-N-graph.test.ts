import { randomUUID } from 'crypto';
import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { GraphRelationship } from 'decorator/property/GraphRelationship';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { Date as Neo4jDate } from 'neo4j-driver';
import { Node } from 'neo4j-driver-core';
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
  @Property() private birthday: Date;

  constructor(id: string, birthday: Date) {
    this.id = id;
    this.birthday = birthday;
  }
}

@RelationshipEntity('IS_CUSTOMER')
class IsCustomer {
  @Primary() private id: string;
  @Property() private visited: Date;

  constructor(id: string, visited: Date) {
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

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('FindOne N-R-N graph', () => {
  const addShop = async (id: string, name: string) => {
    return await neo4jFixture.addNode('Shop', { id, name });
  };
  const addCustomer = async (id: string, birthday: Neo4jDate<number>) => {
    return await neo4jFixture.addNode('Customer', { id, birthday });
  };
  const connect = async (
    shop: Node,
    customer: Node,
    id: string,
    visited: Neo4jDate<number>
  ) => {
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      { id, visited },
      shop,
      customer,
      '<-'
    );
  };

  beforeAll(async () => {
    const shop1 = await addShop(id.get('shop1'), 'MyShop1');
    const customer1 = await addCustomer(
      id.get('customer1'),
      new Neo4jDate(2000, 1, 1)
    );
    await connect(
      shop1,
      customer1,
      id.get('isCustomer1'),
      new Neo4jDate(2022, 1, 1)
    );

    const shop2 = await addShop(id.get('shop2'), 'MyShop2');
    const customer2 = await addCustomer(
      id.get('customer2'),
      new Neo4jDate(2000, 2, 1)
    );
    await connect(
      shop2,
      customer2,
      id.get('isCustomer2'),
      new Neo4jDate(2022, 2, 1)
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test('findOne', async () => {
    const query = qd
      .builder()
      .findOne(ShopCustomer)
      .where('shop.id=$shop.id')
      .buildQuery({
        shop: { id: id.get('shop1') },
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'WHERE n0.id=$shop.id ' +
        'RETURN {shop:n0{.*},isCustomer:r2{.*},customer:n4{.*}} AS _'
    );

    expect(await query.run()).toStrictEqual(
      new ShopCustomer(
        new Shop(id.get('shop1'), 'MyShop1'),
        new IsCustomer(id.get('isCustomer1'), new Date('2022-01-01')),
        new User(id.get('customer1'), new Date('2000-01-01'))
      )
    );
  });

  test('findOne null', async () => {
    const query = qd
      .builder()
      .findOne(ShopCustomer)
      .where('shop.id=$shop.id')
      .buildQuery({
        shop: { id: randomUUID() },
      });

    expect(await query.run()).toBeNull();
  });

  test('findOne with limit', async () => {
    const query = qd
      .builder()
      .findOne(ShopCustomer)
      .where('shop.id IN $shopIds')
      .limit(1)
      .orderBy('shop.name', 'ASC')
      .buildQuery({
        shopIds: [id.get('shop1'), id.get('shop2')],
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'WHERE n0.id IN $shopIds ' +
        'RETURN {shop:n0{.*},isCustomer:r2{.*},customer:n4{.*}} AS _ ' +
        'ORDER BY n0.name ASC ' +
        'LIMIT 1'
    );

    expect(await query.run()).toStrictEqual(
      new ShopCustomer(
        new Shop(id.get('shop1'), 'MyShop1'),
        new IsCustomer(id.get('isCustomer1'), new Date('2022-01-01')),
        new User(id.get('customer1'), new Date('2000-01-01'))
      )
    );
  });

  test('findOne with skip', async () => {
    const query = qd
      .builder()
      .findOne(ShopCustomer)
      .where('shop.id IN $shopIds')
      .limit(1)
      .skip(1)
      .orderBy('shop.name', 'ASC')
      .buildQuery({
        shopIds: [id.get('shop1'), id.get('shop2')],
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'WHERE n0.id IN $shopIds ' +
        'RETURN {shop:n0{.*},isCustomer:r2{.*},customer:n4{.*}} AS _ ' +
        'ORDER BY n0.name ASC ' +
        'SKIP 1 ' +
        'LIMIT 1'
    );

    expect(await query.run()).toStrictEqual(
      new ShopCustomer(
        new Shop(id.get('shop2'), 'MyShop2'),
        new IsCustomer(id.get('isCustomer2'), new Date('2022-02-01')),
        new User(id.get('customer2'), new Date('2000-02-01'))
      )
    );
  });
});
