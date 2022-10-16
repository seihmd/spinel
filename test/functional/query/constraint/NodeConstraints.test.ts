import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { Property } from '../../../../src/decorator/property/Property';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { ConstraintQueryPlan } from '../../../../src/query/builder/constraint/ConstraintQueryPlan';
import { getMetadataStore } from '../../../../src/metadata/store/MetadataStore';
import { ConstraintData } from '../../../../src/query/constraint/ConstraintData';

const neo4jFixture = Neo4jFixture.new();

describe('NodeConstraints', () => {
  beforeEach(async () => {
    await neo4jFixture.clearMeta();
  });

  afterEach(async () => {
    await neo4jFixture.teardown();
  });

  test('ConstraintQueryPlan.exec', async () => {
    @NodeEntity({
      unique: ['name'],
      keys: [['name', 'address']],
    })
    class ConstraintTestNode {
      @Primary() private id: string;

      @Property()
      private name: string;

      @Property({ alias: 'location' })
      private address: string;

      @Property({ notNull: true })
      private startedDate: Date;
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
    const constraintsDataList = result.records.map(
      (record) => record.toObject() as ConstraintData
    );

    expect(constraintsDataList).toMatchObject([
      {
        name: 'SPNL_nk_ConstraintTestNode_location_name',
        type: 'NODE_KEY',
        entityType: 'NODE',
        labelsOrTypes: ['ConstraintTestNode'],
        properties: ['location', 'name'],
      },
      {
        name: 'SPNL_npe_ConstraintTestNode_id',
        type: 'NODE_PROPERTY_EXISTENCE',
        entityType: 'NODE',
        labelsOrTypes: ['ConstraintTestNode'],
        properties: ['id'],
      },
      {
        name: 'SPNL_npe_ConstraintTestNode_startedDate',
        type: 'NODE_PROPERTY_EXISTENCE',
        entityType: 'NODE',
        labelsOrTypes: ['ConstraintTestNode'],
        properties: ['startedDate'],
      },
      {
        name: 'SPNL_u_ConstraintTestNode_id',
        type: 'UNIQUENESS',
        entityType: 'NODE',
        labelsOrTypes: ['ConstraintTestNode'],
        properties: ['id'],
      },
      {
        name: 'SPNL_u_ConstraintTestNode_name',
        type: 'UNIQUENESS',
        entityType: 'NODE',
        labelsOrTypes: ['ConstraintTestNode'],
        properties: ['name'],
      },
    ]);
  });
});
