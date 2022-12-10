import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { Primary } from 'decorator/property/Primary';
import { DeleteQueryBuilder } from 'query/builder/delete/DeleteQueryBuilder';
import { DeleteQueryPlan } from 'query/builder/delete/DeleteQueryPlan';
import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();

@RelationshipEntity()
class Has {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

const id = new IdFixture();

describe('delete RelationshipEntity', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('DeleteQueryBuilder', () => {
    const queryBuilder = DeleteQueryBuilder.new();

    const has = new Has(id.get('has'));
    const [query] = queryBuilder.build(has, false);
    expect(query.get()).toBe('MATCH ()-[r0:HAS{id:$r0.id}]-() DELETE r0');
  });

  test('DeleteQueryPlan', async () => {
    const n1 = await neo4jFixture.addNode('Shop', { id: id.get('shop1') });
    const n2 = await neo4jFixture.addNode('Shop', { id: id.get('shop2') });
    await neo4jFixture.addRelationship(
      'HAS',
      { id: id.get('has') },
      n1,
      n2,
      '->'
    );

    const deleteQueryPlan = DeleteQueryPlan.new(neo4jFixture.getDriver());
    const has = new Has(id.get('has'));
    await deleteQueryPlan.execute(has, false);

    const relationship = await neo4jFixture.findRelationship(
      'HAS',
      id.get('has')
    );
    expect(relationship).toBeNull();
  });
});
