import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { getMetadataStore } from 'metadata/store/MetadataStore';
import { ConstraintQueryPlan } from 'query/builder/constraint/ConstraintQueryPlan';
import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();

describe('relationship constraints', () => {
  beforeEach(async () => {
    await neo4jFixture.clearMeta();
  });

  afterEach(async () => {
    await neo4jFixture.teardown();
  });

  afterAll(async () => {
    await neo4jFixture.close();
  });

  test('ConstraintQueryPlan.exec', async () => {
    @RelationshipEntity()
    class ConstraintTestRelationship {
      @Primary() private id: string;

      @Property({ notNull: true })
      private name: string;

      @Property({ alias: 'visitedAt', notNull: true })
      private date: Date;
    }

    const constraintQueryPlan = new ConstraintQueryPlan(
      getMetadataStore(),
      neo4jFixture.getDriver()
    );
    await constraintQueryPlan.exec(true, true);

    const result = await neo4jFixture
      .getDriver()
      .session()
      .run('SHOW CONSTRAINTS');
    const constraintsDataList = result.records.map((record) =>
      record.toObject()
    );

    expect(constraintsDataList).toMatchObject([
      {
        name: 'SPNL_c_rpe_CONSTRAINT_TEST_RELATIONSHIP_id',
        type: 'RELATIONSHIP_PROPERTY_EXISTENCE',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['CONSTRAINT_TEST_RELATIONSHIP'],
        properties: ['id'],
      },
      {
        name: 'SPNL_c_rpe_CONSTRAINT_TEST_RELATIONSHIP_name',
        type: 'RELATIONSHIP_PROPERTY_EXISTENCE',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['CONSTRAINT_TEST_RELATIONSHIP'],
        properties: ['name'],
      },
      {
        name: 'SPNL_c_rpe_CONSTRAINT_TEST_RELATIONSHIP_visitedAt',
        type: 'RELATIONSHIP_PROPERTY_EXISTENCE',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['CONSTRAINT_TEST_RELATIONSHIP'],
        properties: ['visitedAt'],
      },
    ]);
  });
});
