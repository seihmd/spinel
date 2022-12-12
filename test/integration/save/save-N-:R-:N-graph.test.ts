import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

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
const neo4jFixture = Neo4jFixture.new();
const qb = new QueryBuilder(neo4jFixture.getDriver());

describe('save N-:R-:N graph', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('save', async () => {
    const shopCustomer = new ShopCustomer(new Shop(id.get('shop')));
    const query = qb.save(shopCustomer);

    expect(query.getStatement()).toBe(
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'SET n0=$n0'
    );

    await query.run();
    const savedValue = await neo4jFixture.findGraph(
      `MATCH (shop:Shop{id:"${id.get(
        'shop'
      )}"})<-[isCustomer:IS_CUSTOMER]-(customer:Customer)
      RETURN shop, isCustomer, customer`
    );

    expect(savedValue).toStrictEqual({
      shop: {
        id: id.get('shop'),
      },
      customer: {},
      isCustomer: {},
    });
  });
});
