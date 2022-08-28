import 'reflect-metadata';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import { NodeEntity } from '../../../src/decorator/class/NodeEntity';
import { Primary } from '../../../src/decorator/property/Primary';
import { GraphNode } from '../../../src/decorator/property/GraphNode';
import { Graph } from '../../../src/decorator/class/Graph';
import { QueryPlan } from '../../../src/query/builder/QueryPlan';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { GraphParameter } from '../../../src/query/parameter/GraphParameter';
import { StemBuilder } from '../../../src/query/builder/StemBuilder';
import { getMetadataStore } from '../../../src/metadata/store/MetadataStore';
import { IdFixture } from '../fixtures/IdFixture';
import { WhereQueries } from '../../../src/query/builder/where/WhereQueries';

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
    const stemBuilder = new StemBuilder(getMetadataStore());
    const queryBuilder = new QueryBuilder(stemBuilder);
    const query = queryBuilder.build(
      ShopCustomer,
      new WhereQueries([]),
      new GraphParameter('', {})
    );
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'RETURN {shop:n0{.*}} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(
      ShopCustomer,
      new WhereQueries([]),
      {}
    );
    expect(results).toStrictEqual([new ShopCustomer(new Shop(id.get('shop')))]);
  });
});
