import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { RelationshipEntity } from '../../../src/decorator/class/RelationshipEntity';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity()
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@NodeEntity()
class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@RelationshipEntity()
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
    await neo4jFixture.addRelationship(
      'HAS',
      { id: id.get('has') },
      await neo4jFixture.addNode('Shop', { id: id.get('shop') }),
      await neo4jFixture.addNode('Item', { id: id.get('item') }),
      '->'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  async function assertDetached(): Promise<void> {
    const has = await neo4jFixture.findRelationship('HAS', id.get('has'));
    expect(has).toBeNull();
  }

  test('detach any relationship', async () => {
    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item'));
    const query = qd.builder().detach(shop, item);

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop)-[r]->(n4:Item) DELETE r'
    );
    await query.run();
    await assertDetached();
  });

  test('detach with relationship type', async () => {
    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item'));
    const query = qd.builder().detach(shop, item, 'HAS');

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop)-[r2:HAS]->(n4:Item) DELETE r2'
    );
    await query.run();
    await assertDetached();
  });

  test('detach with relationship constructor', async () => {
    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item'));
    const query = qd.builder().detach(item, shop, Has, '<-');

    expect(query.getStatement()).toBe(
      'MATCH (n0:Item)<-[r2:HAS]-(n4:Shop) DELETE r2'
    );
    await query.run();
    await assertDetached();
  });
});
