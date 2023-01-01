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

describe('Find nodes', () => {
  beforeAll(async () => {
    await neo4jFixture.addNode('Shop', {
      id: id.get('shop1'),
      name: 'Shop1',
    });
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test('save', async () => {
    const shop = new Shop(new ID(id.get('shop')), 'shopName');
    const query = qd.builder().save(shop);

    expect(query.getStatement()).toBe('MERGE (n0:Shop{id:$n0.id}) SET n0=$n0');

    await query.run();

    const savedValue = await neo4jFixture.findNode('Shop', id.get('shop'));
    expect(savedValue).toStrictEqual({
      id: id.get('shop'),
      name: 'shopName',
    });
  });
});
