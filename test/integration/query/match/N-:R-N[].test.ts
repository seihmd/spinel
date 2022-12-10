import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
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

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('shop')
class ShopCustomer {
  @GraphNode() private shop: Shop;
  @GraphBranch(User, 'shop<-:IS_CUSTOMER-*') private customers: User[];

  constructor(shop: Shop, customers: User[]) {
    this.shop = shop;
    this.customers = customers;
  }
}

const id = new IdFixture();

describe('map Neo4j Record into N-:R-N[] Graph class', () => {
  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', {
      id: id.get('shop1'),
    });
    await neo4jFixture.addNode('Shop', {
      id: id.get('shop2'),
    });
    const customer1 = await neo4jFixture.addNode('Customer', {
      id: id.get('customer1'),
    });
    const customer2 = await neo4jFixture.addNode('Customer', {
      id: id.get('customer2'),
    });
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      {},
      shop,
      customer1,
      '<-'
    );
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      {},
      shop,
      customer2,
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
      new OrderByQueries([])
    );
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop) ' +
        'RETURN {shop:n0{.*},' +
        'customers:[(n0)<-[b0_r2:IS_CUSTOMER]-(b0_n4:Customer)|b0_n4{.*}]} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(ShopCustomer, {
      whereQueries: new WhereQueries([
        new WhereQuery(null, '{shop}.id=$shop.id'),
      ]),
      parameters: {
        shop: { id: id.get('shop1') },
      },
    });
    expect(results).toStrictEqual([
      new ShopCustomer(new Shop(id.get('shop1')), [
        new User(id.get('customer2')),
        new User(id.get('customer1')),
      ]),
    ]);
  });

  test('no customers', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(ShopCustomer, {
      whereQueries: new WhereQueries([
        new WhereQuery(null, '{shop}.id=$shop.id'),
      ]),
      parameters: {
        shop: { id: id.get('shop2') },
      },
    });
    expect(results).toStrictEqual([
      new ShopCustomer(new Shop(id.get('shop2')), []),
    ]);
  });
});
