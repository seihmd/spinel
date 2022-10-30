import 'reflect-metadata';
import { GraphRelationship } from '../../../../src/decorator/property/GraphRelationship';
import { WhereQuery } from '../../../../src/query/builder/where/WhereQuery';
import { IdFixture } from '../../fixtures/IdFixture';
import { WhereQueries } from '../../../../src/query/builder/where/WhereQueries';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { QueryBuilder } from '../../../../src/query/builder/match/QueryBuilder';
import { RelationshipEntity } from '../../../../src/decorator/class/RelationshipEntity';
import { QueryPlan } from '../../../../src/query/builder/match/QueryPlan';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Graph } from '../../../../src/decorator/class/Graph';
import { Primary } from '../../../../src/decorator/property/Primary';
import { Property } from '../../../../src/decorator/property/Property';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { OrderByQueries } from '../../../../src/query/builder/orderBy/OrderByQueries';
import { Node } from 'neo4j-driver-core';
import { Date as Neo4jDate } from 'neo4j-driver';
import { OrderByQuery } from '../../../../src/query/builder/orderBy/OrderByQuery';
import { Sort } from '../../../../src/query/literal/OrderByLiteral';

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

describe('map Neo4j Record into N-R-N Graph class', () => {
  const addShop = async (id: string, name: string) => {
    return await neo4jFixture.addNode('Shop', { id, name });
  };
  const addCustomer = async (id: string, birthday: Neo4jDate<number>) => {
    return await neo4jFixture.addNode('Customer', { id, birthday });
  };
  const connect = async (
    shop: Node,
    customer: Node,
    id: string,
    visited: Neo4jDate<number>
  ) => {
    await neo4jFixture.addRelationship(
      'IS_CUSTOMER',
      { id, visited },
      shop,
      customer,
      '<-'
    );
  };

  beforeAll(async () => {
    const shop1 = await addShop(id.get('shop1'), 'MyShop1');
    const customer1 = await addCustomer(
      id.get('customer1'),
      new Neo4jDate(2000, 1, 1)
    );
    await connect(
      shop1,
      customer1,
      id.get('isCustomer1'),
      new Neo4jDate(2022, 1, 1)
    );

    const shop2 = await addShop(id.get('shop2'), 'MyShop2');
    const customer2 = await addCustomer(
      id.get('customer2'),
      new Neo4jDate(2000, 2, 1)
    );
    await connect(
      shop2,
      customer2,
      id.get('isCustomer2'),
      new Neo4jDate(2022, 2, 1)
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
      'MATCH (n0:Shop)<-[r2:IS_CUSTOMER]-(n4:Customer) ' +
        'RETURN {shop:n0{.*},isCustomer:r2{.*},customer:n4{.*}} AS _'
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
      new ShopCustomer(
        new Shop(id.get('shop1'), 'MyShop1'),
        new IsCustomer(id.get('isCustomer1'), new Date('2022-01-01')),
        new User(id.get('customer1'), new Date('2000-01-01'))
      ),
    ]);
  });

  test.each([
    [
      'ASC',
      [
        new ShopCustomer(
          new Shop(id.get('shop1'), 'MyShop1'),
          new IsCustomer(id.get('isCustomer1'), new Date('2022-01-01')),
          new User(id.get('customer1'), new Date('2000-01-01'))
        ),
        new ShopCustomer(
          new Shop(id.get('shop2'), 'MyShop2'),
          new IsCustomer(id.get('isCustomer2'), new Date('2022-02-01')),
          new User(id.get('customer2'), new Date('2000-02-01'))
        ),
      ],
    ],
    [
      'DESC',
      [
        new ShopCustomer(
          new Shop(id.get('shop2'), 'MyShop2'),
          new IsCustomer(id.get('isCustomer2'), new Date('2022-02-01')),
          new User(id.get('customer2'), new Date('2000-02-01'))
        ),
        new ShopCustomer(
          new Shop(id.get('shop1'), 'MyShop1'),
          new IsCustomer(id.get('isCustomer1'), new Date('2022-01-01')),
          new User(id.get('customer1'), new Date('2000-01-01'))
        ),
      ],
    ],
  ] as [Sort, ShopCustomer[]][])(
    'QueryPlan with sort',
    async (sort: Sort, expected: ShopCustomer[]) => {
      const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

      const results = await queryPlan.execute(ShopCustomer, {
        whereQueries: new WhereQueries([
          new WhereQuery(null, '{shop}.id IN $shopIds'),
        ]),
        orderByQueries: new OrderByQueries([
          new OrderByQuery('{isCustomer}.visited', sort),
        ]),
        parameters: {
          shopIds: [id.get('shop1'), id.get('shop2')],
        },
      });
      expect(results).toStrictEqual(expected);
    }
  );
});
