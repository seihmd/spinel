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
  @Property() private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

@NodeEntity({ label: 'Customer' })
class User {
  @Primary() private id: string;
  @Property() private birthday: Date;

  constructor(id: string, birthday: Date) {
    this.id = id;
    this.birthday = birthday;
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
    const node1 = await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
      name: 'MyShop',
    });
    const node2 = await neo4jFixture.addNode('Customer', {
      id: id.get('customer'),
      birthday: '2000-01-01',
    });
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      { id: id.get('isCustomer'), visited: '2022-01-01' },
      node1,
      node2,
      '<-'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('QueryBuilder', () => {
    const queryBuilder = QueryBuilder.new();
    const query = queryBuilder.build(
      ShopCustomer,
      new WhereQueries([]),
      new OrderByQueries([]),
      Depth.withDefault()
    );
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'RETURN {shop:n0{.*},isCustomer:r2{.*},customer:n4{.*}} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const whereQueries = new WhereQueries([
      new WhereQuery(null, '{shop}.id = $shop.id'),
    ]);

    const results = await queryPlan.execute(ShopCustomer, {
      whereQueries,
      parameters: {
        shop: { id: id.get('shop') },
        isCustomer: { visited: new Date('2022-01-01') },
        customer: { birthday: new Date('2000-01-01') },
      },
    });

    expect(results).toStrictEqual([
      new ShopCustomer(
        new Shop(id.get('shop'), 'MyShop'),
        new IsCustomer(id.get('isCustomer'), new Date('2022-01-01')),
        new User(id.get('customer'), new Date('2000-01-01'))
      ),
    ]);
  });
});
