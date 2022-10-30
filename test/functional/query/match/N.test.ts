import 'reflect-metadata';
import { WhereQuery } from '../../../../src/query/builder/where/WhereQuery';
import { IdFixture } from '../../fixtures/IdFixture';
import { WhereQueries } from '../../../../src/query/builder/where/WhereQueries';
import { QueryBuilder } from '../../../../src/query/builder/match/QueryBuilder';
import { QueryPlan } from '../../../../src/query/builder/match/QueryPlan';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { Property } from '../../../../src/decorator/property/Property';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { OrderByQueries } from '../../../../src/query/builder/orderBy/OrderByQueries';
import { OrderByQuery } from '../../../../src/query/builder/orderBy/OrderByQuery';
import { Sort } from '../../../../src/query/literal/OrderByLiteral';

const neo4jFixture = Neo4jFixture.new();

@NodeEntity()
class Shop {
  @Primary() id: string;
  @Property() name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const id = new IdFixture();

describe('map Neo4j Record into Node class', () => {
  beforeAll(async () => {
    await neo4jFixture.addNode('Shop', {
      id: id.get('shop1'),
      name: 'Shop1',
    });

    await neo4jFixture.addNode('Shop', {
      id: id.get('shop2'),
      name: 'Shop2',
    });
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('QueryBuilder', () => {
    const queryBuilder = QueryBuilder.new();
    const query = queryBuilder.build(
      Shop,
      new WhereQueries([new WhereQuery(null, '{*}.id IN $shopIds')]),
      new OrderByQueries([new OrderByQuery('{*}.id', 'ASC')])
    );
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop) WHERE n0.id IN $shopIds RETURN n0{.*} AS _ ORDER BY n0.id ASC'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(Shop, {
      whereQueries: new WhereQueries([
        new WhereQuery(null, '{*}.id IN $shopIds'),
      ]),
      parameters: {
        shopIds: [id.get('shop1'), id.get('shop2')],
      },
    });
    expect(results).toStrictEqual([
      new Shop(id.get('shop1'), 'Shop1'),
      new Shop(id.get('shop2'), 'Shop2'),
    ]);
  });

  test.each([
    [
      'ASC',
      [new Shop(id.get('shop1'), 'Shop1'), new Shop(id.get('shop2'), 'Shop2')],
    ],
    [
      'DESC',
      [new Shop(id.get('shop2'), 'Shop2'), new Shop(id.get('shop1'), 'Shop1')],
    ],
  ] as [Sort, Shop[]][])(
    'QueryPlan with sort',
    async (sort: Sort, expected: Shop[]) => {
      const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

      const results = await queryPlan.execute(Shop, {
        whereQueries: new WhereQueries([
          new WhereQuery(null, '{*}.id IN $shopIds'),
        ]),
        orderByQueries: new OrderByQueries([
          new OrderByQuery('{*}.name', sort),
        ]),
        parameters: {
          shopIds: [id.get('shop1'), id.get('shop2')],
        },
      });
      expect(results).toStrictEqual(expected);
    }
  );
});
