import 'reflect-metadata';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import { NodeEntity } from '../../../src/decorator/class/NodeEntity';
import { Primary } from '../../../src/decorator/property/Primary';
import { GraphNode } from '../../../src/decorator/property/GraphNode';
import { Graph } from '../../../src/decorator/class/Graph';
import { QueryPlan } from '../../../src/query/builder/QueryPlan';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { StemBuilder } from '../../../src/query/builder/StemBuilder';
import { IdFixture } from '../fixtures/IdFixture';
import { WhereQueries } from '../../../src/query/builder/where/WhereQueries';
import { WhereQuery } from '../../../src/query/builder/where/WhereQuery';
import { Depth } from '../../../src/domain/graph/branch/Depth';

const neo4jFixture = Neo4jFixture.new();

@NodeEntity()
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('shop<-:IS_CUSTOMER-:Customer')
class ShopCustomer {
  @GraphNode() private shop: Shop;

  constructor(shop: Shop) {
    this.shop = shop;
  }
}

const id = new IdFixture();

describe('map Neo4j Record into N-:R-:N Graph class', () => {
  beforeAll(async () => {
    const node1 = await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
    });
    const node2 = await neo4jFixture.addNode('Customer', {
      id: id.get('customer'),
    });
    await neo4jFixture.addRelationship('IS_CUSTOMER', {}, node1, node2, '<-');
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('QueryBuilder', () => {
    const queryBuilder = new QueryBuilder(StemBuilder.new());
    const query = queryBuilder.build(ShopCustomer, new WhereQueries([]));
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'RETURN {shop:n0{.*}} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const whereQueries = new WhereQueries([
      new WhereQuery(null, '{shop}.id = $shopId'),
    ]);

    const results = await queryPlan.execute(
      ShopCustomer,
      whereQueries,
      Depth.withDefault(),
      { shopId: id.get('shop') }
    );
    expect(results).toStrictEqual([new ShopCustomer(new Shop(id.get('shop')))]);
  });
});
