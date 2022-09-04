import 'reflect-metadata';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import { NodeEntity } from '../../../src/decorator/class/NodeEntity';
import { Primary } from '../../../src/decorator/property/Primary';
import { GraphNode } from '../../../src/decorator/property/GraphNode';
import { Graph } from '../../../src/decorator/class/Graph';
import { QueryPlan } from '../../../src/query/builder/QueryPlan';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { StemBuilder } from '../../../src/query/builder/StemBuilder';
import { GraphBranch } from '../../../src/decorator/property/GraphBranch';
import { IdFixture } from '../fixtures/IdFixture';
import { WhereQueries } from '../../../src/query/builder/where/WhereQueries';
import { Depth } from '../../../src/domain/graph/branch/Depth';
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
    const queryBuilder = new QueryBuilder(StemBuilder.new());
    const query = queryBuilder.build(ShopCustomer, new WhereQueries([]));
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop) ' +
        'RETURN {shop:n0{.*},' +
        'customers:[(n0)<-[b0_r2:IS_CUSTOMER]-(b0_n4:Customer)|b0_n4{.*}]} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(
      ShopCustomer,
      new WhereQueries([new WhereQuery(null, '{shop}.id=$shop.id')]),
      Depth.withDefault(),
      {
        shop: { id: id.get('shop1') },
      }
    );
    expect(results).toStrictEqual([
      new ShopCustomer(new Shop(id.get('shop1')), [
        new User(id.get('customer2')),
        new User(id.get('customer1')),
      ]),
    ]);
  });

  test('no customers', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(
      ShopCustomer,
      new WhereQueries([new WhereQuery(null, '{shop}.id=$shop.id')]),
      Depth.withDefault(),
      {
        shop: { id: id.get('shop2') },
      }
    );
    expect(results).toStrictEqual([
      new ShopCustomer(new Shop(id.get('shop2')), []),
    ]);
  });
});
