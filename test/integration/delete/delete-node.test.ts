import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';

import 'reflect-metadata';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@NodeEntity()
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

const id = new IdFixture();
const neo4jFixture = Neo4jFixture.new();
const qb = new QueryBuilder(neo4jFixture.getDriver());

describe('Delete node', () => {
  beforeAll(async () => {
    await neo4jFixture.addNode('Shop', { id: id.get('shop') });
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('delete', async () => {
    const shop = new Shop(id.get('shop'));

    const query = qb.delete(shop);
    expect(query.getStatement()).toBe('MATCH (n0:Shop{id:$n0.id}) DELETE n0');

    await query.run();

    expect(await neo4jFixture.findNode('Shop', id.get('shop'))).toBeNull();
  });
});
