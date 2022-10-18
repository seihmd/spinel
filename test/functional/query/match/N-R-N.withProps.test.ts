import 'reflect-metadata';
import { GraphRelationship } from '../../../../src/decorator/property/GraphRelationship';
import { WhereQuery } from '../../../../src/query/builder/where/WhereQuery';
import { IdFixture } from '../../fixtures/IdFixture';
import { WhereQueries } from '../../../../src/query/builder/where/WhereQueries';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { QueryBuilder } from '../../../../src/query/builder/match/QueryBuilder';
import { RelationshipEntity } from '../../../../src/decorator/class/RelationshipEntity';
import { QueryPlan } from '../../../../src/query/builder/match/QueryPlan';
import { Depth } from '../../../../src/domain/graph/branch/Depth';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Graph } from '../../../../src/decorator/class/Graph';
import { Primary } from '../../../../src/decorator/property/Primary';
import { StemBuilder } from '../../../../src/query/builder/match/StemBuilder';
import { Property } from '../../../../src/decorator/property/Property';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';

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
    const queryBuilder = new QueryBuilder(StemBuilder.new());
    const query = queryBuilder.build(
      ShopCustomer,
      new WhereQueries([]),
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

    const results = await queryPlan.execute(
      ShopCustomer,
      whereQueries,
      Depth.withDefault(),
      {
        shop: { id: id.get('shop') },
        isCustomer: { visited: new Date('2022-01-01') },
        customer: { birthday: new Date('2000-01-01') },
      }
    );

    expect(results).toStrictEqual([
      new ShopCustomer(
        new Shop(id.get('shop'), 'MyShop'),
        new IsCustomer(id.get('isCustomer'), new Date('2022-01-01')),
        new User(id.get('customer'), new Date('2000-01-01'))
      ),
    ]);
  });
});
