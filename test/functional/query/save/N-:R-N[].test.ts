import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Graph } from '../../../../src/decorator/class/Graph';
import { Primary } from '../../../../src/decorator/property/Primary';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { GraphBranch } from '../../../../src/decorator/property/GraphBranch';
import { SaveQueryBuilder } from '../../../../src/query/builder/save/SaveQueryBuilder';

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

describe('save N-:R-N[] Graph class', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test.each([
    [[], 'MERGE (n0:Shop{id:$n0.id}) SET n0=$n0'],
    [
      [id.get('user1')],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (b0_0_n4:Customer{id:$b0_0_n4.id}) ' +
        'MERGE (n0)<-[b0_0_r2:IS_CUSTOMER]-(b0_0_n4) S' +
        'ET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4',
    ],
    [
      [id.get('user1'), id.get('user2')],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (b0_0_n4:Customer{id:$b0_0_n4.id}) ' +
        'MERGE (b0_1_n4:Customer{id:$b0_1_n4.id}) ' +
        'MERGE (n0)<-[b0_0_r2:IS_CUSTOMER]-(b0_0_n4) ' +
        'MERGE (n0)<-[b0_1_r2:IS_CUSTOMER]-(b0_1_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_1_n4=$b0_1_n4',
    ],
  ])('SaveQueryBuilder', (userIds: string[], expected: string) => {
    const queryBuilder = SaveQueryBuilder.new();
    const shopCustomer = new ShopCustomer(
      new Shop(id.get('shop')),
      userIds.map((id) => new User(id))
    );
    const [query] = queryBuilder.build(shopCustomer);
    expect(query.get()).toBe(expected);
  });
});
