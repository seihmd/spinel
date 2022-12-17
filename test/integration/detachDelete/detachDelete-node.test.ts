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

describe('DetachDelete node', () => {
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

  async function assertDetachDeleted(): Promise<void> {
    expect(await neo4jFixture.findNode('Shop', id.get('shop'))).toStrictEqual(
      null
    );
    expect(
      await neo4jFixture.findRelationship('HAS', id.get('has'))
    ).toStrictEqual(null);
    expect(await neo4jFixture.findNode('Item', id.get('item'))).toStrictEqual({
      id: id.get('item'),
    });
  }

  test('detach and delete', async () => {
    const shop = new Shop(id.get('shop'));
    const query = qd.builder().detachDelete(shop);

    expect(query.getStatement()).toBe(
      'MATCH (n0:Shop{id:$n0.id}) DETACH DELETE n0'
    );
    await query.run();
    await assertDetachDeleted();
  });
});
