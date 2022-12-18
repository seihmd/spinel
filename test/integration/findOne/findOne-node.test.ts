import { randomUUID } from 'crypto';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
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

describe('FindOne node', () => {
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

  test('findOne', async () => {
    const shops = await qd
      .builder()
      .findOne(Shop, 's')
      .where('{@}.id = $shopId')
      .buildQuery({
        shopId: id.get('shop1'),
      })
      .run();

    expect(shops).toStrictEqual(new Shop(id.get('shop1'), 'Shop1'));
  });

  test('findOne null', async () => {
    const shops = await qd
      .builder()
      .findOne(Shop, 's')
      .where('{@}.id = $shopId')
      .buildQuery({
        shopId: randomUUID(),
      })
      .run();

    expect(shops).toBeNull();
  });
});
