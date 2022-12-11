import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

@RelationshipEntity()
class Has {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

const id = new IdFixture();
const neo4jFixture = Neo4jFixture.new();
const qb = new QueryBuilder(neo4jFixture.getDriver());

describe('Delete relationship', () => {
  beforeAll(async () => {
    const n1 = await neo4jFixture.addNode('Shop', { id: id.get('shop1') });
    const n2 = await neo4jFixture.addNode('Shop', { id: id.get('shop2') });
    await neo4jFixture.addRelationship(
      'HAS',
      { id: id.get('has') },
      n1,
      n2,
      '->'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('delete', async () => {
    const has = new Has(id.get('has'));

    const query = qb.delete(has);
    expect(query.getStatement()).toBe(
      'MATCH ()-[r0:HAS{id:$r0.id}]-() DELETE r0'
    );

    await query.run();

    expect(
      await neo4jFixture.findRelationship('HAS', id.get('has'))
    ).toBeNull();
  });
});
