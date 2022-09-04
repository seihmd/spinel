import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Graph } from '../../../../src/decorator/class/Graph';
import { IdFixture } from '../../fixtures/IdFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { SaveQueryBuilder } from '../../../../src/query/builder/save/SaveQueryBuilder';

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

describe('save N-:R-:N Graph class', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('SaveQueryBuilder', () => {
    const queryBuilder = SaveQueryBuilder.new();
    const shopCustomer = new ShopCustomer(new Shop(id.get('shop')));
    const [query] = queryBuilder.build(shopCustomer);
    expect(query.get()).toBe(
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (n0)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'SET n0=$n0'
    );
  });
});
