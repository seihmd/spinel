import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { Property } from '../../../../src/decorator/property/Property';
import { ConstraintQueryPlan } from '../../../../src/query/builder/constraint/ConstraintQueryPlan';
import { getMetadataStore } from '../../../../src/metadata/store/MetadataStore';
import { RelationshipEntity } from '../../../../src/decorator/class/RelationshipEntity';

const neo4jFixture = Neo4jFixture.new();

describe('relationship constraints', () => {
  beforeEach(async () => {
    await neo4jFixture.clearMeta();
  });
  afterEach(async () => {
    await neo4jFixture.teardown();
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
