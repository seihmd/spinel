import 'reflect-metadata';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import { NodeEntity } from '../../../src/decorator/class/NodeEntity';
import { Primary } from '../../../src/decorator/property/Primary';
import { Property } from '../../../src/decorator/property/Property';
import { RelationshipEntity } from '../../../src/decorator/class/RelationshipEntity';
import { GraphNode } from '../../../src/decorator/property/GraphNode';
import { GraphRelationship } from '../../../src/decorator/property/GraphRelationship';
import { Graph } from '../../../src/decorator/class/Graph';
import { QueryPlan } from '../../../src/query/builder/QueryPlan';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { GraphParameter } from '../../../src/query/parameter/GraphParameter';
import { StemBuilder } from '../../../src/query/builder/StemBuilder';
import { getMetadataStore } from '../../../src/metadata/store/MetadataStore';
import { IdFixture } from '../fixtures/IdFixture';
import { WhereQueries } from '../../../src/query/builder/where/WhereQueries';
import { WhereQuery } from '../../../src/query/builder/where/WhereQuery';

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
    const stemBuilder = new StemBuilder(getMetadataStore());
    const queryBuilder = new QueryBuilder(stemBuilder);
    const query = queryBuilder.build(
      ShopCustomer,
      whereQueries,
      new GraphParameter('', {
        shop: { id: id.get('shop') },
        visitedFrom: '2020-01-01',
        emailPattern: '^customer3@',
      })
    );

    expect(query.get('_')).toBe(
      'MATCH (n0:Shop{id:$shop.id})<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'WHERE r2.visited >= $visitedFrom AND n4.email =~ $emailPattern ' +
        'RETURN {shop:n0{.*},isCustomer:r2{.*},customer:n4{.*}} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());
    const results = await queryPlan.execute(ShopCustomer, whereQueries, {
      shop: { id: id.get('shop') },
      visitedFrom: '2020-01-01',
      emailPattern: 'customer3@.*',
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
