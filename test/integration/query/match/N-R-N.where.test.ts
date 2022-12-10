import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { GraphRelationship } from 'decorator/property/GraphRelationship';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { Depth } from 'domain/graph/branch/Depth';
import { QueryBuilder } from 'query/builder/match/QueryBuilder';
import { QueryPlan } from 'query/builder/match/QueryPlan';
import { OrderByQueries } from 'query/builder/orderBy/OrderByQueries';
import { WhereQueries } from 'query/builder/where/WhereQueries';
import { WhereQuery } from 'query/builder/where/WhereQuery';
import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';

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
  @Property() private email: string;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }
}

@RelationshipEntity()
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

const id = new IdFixture();

describe('map Neo4j Record into N-R-N Graph class with property', () => {
  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
      name: 'MyShop',
    });
    const customer1 = await neo4jFixture.addNode('Customer', {
      id: id.get('customer1'),
      email: 'customer1@example.com',
    });
    const customer2 = await neo4jFixture.addNode('Customer', {
      id: id.get('customer2'),
      email: 'customer2@example.com',
    });
    const customer3 = await neo4jFixture.addNode('Customer', {
      id: id.get('customer3'),
      email: 'customer3@example.com',
    });
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      { id: id.get('isCustomer1'), visited: '2019-12-31' },
      shop,
      customer1,
      '<-'
    );
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      { id: id.get('isCustomer2'), visited: '2020-01-01' },
      shop,
      customer2,
      '<-'
    );
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      { id: id.get('isCustomer3'), visited: '2020-01-01' },
      shop,
      customer3,
      '<-'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  const whereQueries = new WhereQueries([
    new WhereQuery(
      null,
      '{isCustomer}.visited >= $visitedFrom AND ' +
        '{customer}.email =~ $emailPattern'
    ),
  ]);

  test('QueryBuilder', () => {
    const queryBuilder = QueryBuilder.new();
    const query = queryBuilder.build(
      ShopCustomer,
      whereQueries,
      new OrderByQueries([]),
      Depth.withDefault()
    );

    expect(query.get('_')).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'WHERE r2.visited >= $visitedFrom AND n4.email =~ $emailPattern ' +
        'RETURN {shop:n0{.*},isCustomer:r2{.*},customer:n4{.*}} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());
    const results = await queryPlan.execute(ShopCustomer, {
      whereQueries,
      parameters: {
        shop: { id: id.get('shop') },
        visitedFrom: '2020-01-01',
        emailPattern: 'customer3@.*',
      },
    });
    expect(results).toStrictEqual([
      new ShopCustomer(
        new Shop(id.get('shop')),
        new IsCustomer(id.get('isCustomer3'), new Date('2020-01-01')),
        new User(id.get('customer3'), 'customer3@example.com')
      ),
    ]);
  });
});
