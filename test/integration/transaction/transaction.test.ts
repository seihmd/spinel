import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { GraphNode } from 'decorator/property/GraphNode';
import { GraphRelationship } from 'decorator/property/GraphRelationship';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { QueryDriver } from 'query/driver/QueryDriver';
import 'reflect-metadata';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity()
class Shop {
  @Primary() private id: string;
  @Property() private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  updateName(name: string): void {
    this.name = name;
  }
}

@NodeEntity({ label: 'Customer' })
class User {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@RelationshipEntity()
class IsCustomer {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
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

  updateShopName(name: string): void {
    return this.shop.updateName(name);
  }
}

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Transactional query', () => {
  beforeEach(async () => {
    const shop = await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
      name: 'default',
    });
    const customer = await neo4jFixture.addNode('Customer', {
      id: id.get('customer'),
    });
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      { id: id.get('isCustomer') },
      shop,
      customer,
      '<-'
    );
  });

  afterEach(async () => {
    await neo4jFixture.teardown();
  });

  afterAll(async () => {
    await neo4jFixture.close();
  });

  test('commit successfully', async () => {
    await qd.transactional(async (qd) => {
      const shopCustomer = await qd
        .findOne(ShopCustomer, 'sc')
        .where(null, '{shop}.id=$shop.id')
        .buildQuery({
          shop: { id: id.get('shop') },
        })
        .run();

      if (!shopCustomer) {
        throw new Error('shopCustomer not found');
      }

      shopCustomer.updateShopName('updated');

      await qd.save(shopCustomer);
    });

    await assertGraph({
      shop: {
        id: id.get('shop'),
        name: 'updated',
      },
      isCustomer: {
        id: id.get('isCustomer'),
      },
      user: {
        id: id.get('customer'),
      },
    });
  });

  test('rollback', async () => {
    await qd.transactional(async (qd) => {
      const shopCustomer = await qd
        .builder()
        .findOne(ShopCustomer, 'sc')
        .where(null, '{shop}.id=$shop.id')
        .buildQuery({
          shop: { id: id.get('shop') },
        })
        .run();

      if (!shopCustomer) {
        throw new Error('shopCustomer not found');
      }

      shopCustomer.updateShopName('updated');

      await qd.builder().save(shopCustomer).run();

      throw new Error('MUST ROLLBACK');
    });

    await assertGraph({
      shop: {
        id: id.get('shop'),
        name: 'default',
      },
      isCustomer: {
        id: id.get('isCustomer'),
      },
      user: {
        id: id.get('customer'),
      },
    });
  });

  async function assertGraph(expected: Record<string, unknown>) {
    const savedValue = await neo4jFixture.findGraph(
      `MATCH (shop:Shop{id:"${id.get(
        'shop'
      )}"})<-[isCustomer:IS_CUSTOMER{id:"${id.get(
        'isCustomer'
      )}"}]-(user:Customer{id:"${id.get(
        'customer'
      )}"}) RETURN shop, isCustomer, user`
    );

    expect(savedValue).toStrictEqual(expected);
  }
});
