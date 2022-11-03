import {
  initSpinel,
  newSpinelRepository,
  NodeEntity,
  Primary,
  Property,
} from '../../../src';
import { FindQuery } from '../../../src/api/query';
import { Neo4jFixture } from '../fixtures/neo4jFixture';
import { randomUUID } from 'crypto';

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

async function saveShop(id: string, name: string) {
  await neo4jFixture.addNode('Shop', {
    id,
    name,
  });
}

describe(`SpinelRepository`, () => {
  beforeAll(() => {
    initSpinel(neo4jFixture.getDriver());
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('find', async () => {
    const repository = newSpinelRepository();
    const id = randomUUID();
    await saveShop(id, 'shopName');

    const shops = await repository.find(
      new FindQuery(Shop).where('{*}.id = $id').parameter('id', id)
    );

    expect(shops).toStrictEqual([new Shop(id, 'shopName')]);
  });

  test('find existing one', async () => {
    const repository = newSpinelRepository();
    const id = randomUUID();
    await saveShop(id, 'shopName');

    const shop = await repository.findOne(
      new FindQuery(Shop).where('{*}.id = $id').parameter('id', id)
    );

    expect(shop).toStrictEqual(new Shop(id, 'shopName'));
  });

  test('not found', async () => {
    const repository = newSpinelRepository();
    const id = randomUUID();

    const shop = await repository.findOne(
      new FindQuery(Shop).where('{*}.id = $id').parameter('id', id)
    );

    expect(shop).toBeNull();
  });

  test('save', async () => {
    const id = randomUUID();
    const shop = new Shop(id, 'shopName');
    const repository = newSpinelRepository();
    await repository.save(shop);

    const savedValue = await neo4jFixture.findNode('Shop', id);
    expect(savedValue).toStrictEqual({
      id,
      name: 'shopName',
    });
  });
});
