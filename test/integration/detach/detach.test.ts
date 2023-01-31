import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { Primary } from 'decorator/property/Primary';
import { QueryDriver } from 'query/driver/QueryDriver';
import 'reflect-metadata';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity('Shop')
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@NodeEntity('Item')
class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@RelationshipEntity('HAS')
class Has {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

const id = new IdFixture();
const neo4jFixture = Neo4jFixture.new();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('Detach nodes', () => {
  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', { id: id.get('shop') });
    await neo4jFixture.addRelationship(
      'HAS',
      { id: id.get('has1') },
      shop,
      await neo4jFixture.addNode('Item', { id: id.get('item1') }),
      '->'
    );
    await neo4jFixture.addRelationship(
      'HAS',
      { id: id.get('has2') },
      shop,
      await neo4jFixture.addNode('Item', { id: id.get('item2') }),
      '->'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  async function assertDetached(): Promise<void> {
    const has = await neo4jFixture.findRelationship('HAS', id.get('has1'));
    expect(has).toBeNull();
  }

  test('detach any relationship', async () => {
    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item1'));
    const query = qd.builder().detach(shop, item);

    await query.run();

    expect(
      await neo4jFixture.findRelationship('HAS', id.get('has1'))
    ).toBeNull();
    expect(
      await neo4jFixture.findRelationship('HAS', id.get('has2'))
    ).not.toBeNull();
  });

  test('detach with relationship type', async () => {
    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item'));
    const query = qd.builder().detach(shop, item, 'HAS');

    await query.run();
    await assertDetached();
  });

  test('detach with relationship constructor', async () => {
    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item'));
    const query = qd.builder().detach(item, shop, Has, '<-');

    await query.run();
    await assertDetached();
  });

  test('detach any relationships', async () => {
    const query = qd.builder().detach(Shop, null, null, '-');

    await query.run();
    await assertDetached();
  });

  test('detach any relationships of node instance', async () => {
    const query = qd
      .builder()
      .detach(new Shop(id.get('shop')), null, null, '-');

    await query.run();
    await assertDetached();
  });
});
