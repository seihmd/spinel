import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

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

  @GraphBranch(User, 'shop<-[isCustomer:IS_CUSTOMER]-customers')
  private customers: User[];

  constructor(shop: Shop, customers: User[]) {
    this.shop = shop;
    this.customers = customers;
  }
}

const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find N-:R-N[] graphs', () => {
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
    await neo4jFixture.close();
  });

  test('find', async () => {
    const query = qd
      .builder()
      .find(ShopCustomer)
      .where('shop.id=$shop.id')
      .buildQuery({
        shop: { id: id.get('shop1') },
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop) ' +
        'WHERE n0.id=$shop.id ' +
        'RETURN {shop:n0{.*},' +
        'customers:[(n0)<-[b0_r2:IS_CUSTOMER]-(b0_n4:Customer)|b0_n4{.*}]} ' +
        'AS _'
    );

    expect(await query.run()).toStrictEqual([
      new ShopCustomer(new Shop(id.get('shop1')), [
        new User(id.get('customer2')),
        new User(id.get('customer1')),
      ]),
    ]);
  });

  test('find no customers', async () => {
    const query = qd
      .builder()
      .find(ShopCustomer)
      .where('shop.id=$shop.id')
      .buildQuery({
        shop: { id: id.get('shop2') },
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop) ' +
        'WHERE n0.id=$shop.id ' +
        'RETURN {shop:n0{.*},' +
        'customers:[(n0)<-[b0_r2:IS_CUSTOMER]-(b0_n4:Customer)|b0_n4{.*}]} ' +
        'AS _'
    );
    expect(await query.run()).toStrictEqual([
      new ShopCustomer(new Shop(id.get('shop2')), []),
    ]);
  });

  test('find with filterBranch', async () => {
    const query = qd
      .builder()
      .find(ShopCustomer)
      .where('shop.id=$shop.id')
      .filterBranch('customers', 'customers.id IN $customerIds')
      .buildQuery({
        shop: { id: id.get('shop2') },
      });

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop) ' +
        'WHERE n0.id=$shop.id ' +
        'RETURN {shop:n0{.*},' +
        'customers:[(n0)<-[b0_r2:IS_CUSTOMER]-(b0_n4:Customer)|b0_n4{.*}]} ' +
        'AS _'
    );
    expect(await query.run()).toStrictEqual([
      new ShopCustomer(new Shop(id.get('shop2')), []),
    ]);
  });
});
