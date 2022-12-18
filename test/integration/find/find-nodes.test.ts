import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { Sort } from 'query/literal/OrderByLiteral';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity()
class Shop {
  @Primary() id: string;
  @Property() name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find nodes', () => {
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
    await neo4jFixture.close();
  });

  test('find', async () => {
    const shops = await qd
      .builder()
      .find(Shop)
      .where('{@}.id IN $shopIds')
      .buildQuery({
        shopIds: [id.get('shop1'), id.get('shop2')],
      })
      .run();

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
      const shops = await qd
        .builder()
        .find(Shop)
        .where('{@}.id IN $shopIds')
        .orderBy('{@}.name', sort)
        .buildQuery({
          shopIds: [id.get('shop1'), id.get('shop2')],
        })
        .run();

      expect(shops).toStrictEqual(expected);
    }
  );
});
