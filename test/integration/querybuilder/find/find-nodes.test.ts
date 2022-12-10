import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { Sort } from 'query/literal/OrderByLiteral';
import 'reflect-metadata';
import { QueryBuilder } from '../../../../src/query/builder/QueryBuilder';
import { IdFixture } from '../../fixtures/IdFixture';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';

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

  test('find', async () => {
    const qb = new QueryBuilder(neo4jFixture.getDriver());
    const shops = await qb
      .find(Shop, 's')
      .where(null, '{*}.id IN $shopIds')
      .run({
        shopIds: [id.get('shop1'), id.get('shop2')],
      });

    expect(shops).toStrictEqual([
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
    'find with sort',
    async (sort: Sort, expected: Shop[]) => {
      const shops = await new QueryBuilder(neo4jFixture.getDriver())
        .find(Shop, 's')
        .where(null, '{*}.id IN $shopIds')
        .orderBy('{*}.name', sort)
        .run({
          shopIds: [id.get('shop1'), id.get('shop2')],
        });

      expect(shops).toStrictEqual(expected);
    }
  );
});
