import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import 'reflect-metadata';
import { Embeddable } from '../../../src/decorator/class/Embeddable';
import { Embed } from '../../../src/decorator/property/Embed';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@Embeddable()
class ID {
  constructor(value: string) {
    this.id = value;
  }

  @Primary()
  private readonly id: string;
}

@NodeEntity()
class Shop {
  @Embed()
  id: ID;

  @Property() name: string;

  constructor(id: ID, name: string) {
    this.id = id;
    this.name = name;
  }
}

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Find nodes having Embeddable', () => {
  beforeAll(async () => {
    await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
      name: 'Shop1',
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
      .where('shop.id IN $shopIds')
      .buildQuery({
        shopIds: [id.get('shop'), id.get('shop2')],
      })
      .run();

    expect(shops).toStrictEqual([new Shop(new ID(id.get('shop')), 'Shop1')]);
  });
});
