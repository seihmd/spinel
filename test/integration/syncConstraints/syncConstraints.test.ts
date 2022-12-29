import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();
const qd = new QueryDriver(neo4jFixture.getDriver());

@NodeEntity({
  unique: ['name'],
  keys: [['name', 'address']],
  indexes: [
    {
      type: 'btree',
      on: ['name'],
    },
    {
      name: 'index_IndexTestNode_arbitrary_name',
      type: 'fulltext',
      on: ['name', 'description'],
    },
  ],
})
class TestNode {
  @Primary() private id: string;

  @Property()
  private name: string;

  @Property({ alias: 'desc' })
  private description: string;

  @Property({ alias: 'location' })
  private address: string;
}

@RelationshipEntity({
  indexes: [
    {
      type: 'btree',
      on: ['name'],
    },
    {
      type: 'text',
      on: ['memo'],
      options: "{indexProvider: 'text-1.0'}",
    },
  ],
})
class TestRelationship {
  @Primary() private id: string;

  @Property({ notNull: true })
  private name: string;

  @Property({ alias: 'note', notNull: true })
  private memo: string;
}

describe('Sync Constraints and Indexes', () => {
  beforeEach(async () => {
    await neo4jFixture.clearMeta();
  });

  afterEach(async () => {
    await neo4jFixture.teardown();
  });

  afterAll(async () => {
    await neo4jFixture.close();
  });

  test('sync', async () => {
    await qd.syncConstraints();

    await assertConstraints();
    await assertIndexes();
  });

  async function assertConstraints() {
    const result = await neo4jFixture
      .getDriver()
      .session()
      .run('SHOW CONSTRAINTS');
    const constraints = result.records.map(
      (record) => record.toObject() as { name: string }
    );

    expect(constraints).toMatchObject([
      {
        name: 'SPNL_c_nk_TestNode_location_name',
        type: 'NODE_KEY',
        entityType: 'NODE',
        labelsOrTypes: ['TestNode'],
        properties: ['location', 'name'],
      },
      {
        name: 'SPNL_c_npe_TestNode_id',
        type: 'NODE_PROPERTY_EXISTENCE',
        entityType: 'NODE',
        labelsOrTypes: ['TestNode'],
        properties: ['id'],
      },
      {
        name: 'SPNL_c_rpe_TEST_RELATIONSHIP_id',
        type: 'RELATIONSHIP_PROPERTY_EXISTENCE',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['TEST_RELATIONSHIP'],
        properties: ['id'],
      },
      {
        name: 'SPNL_c_rpe_TEST_RELATIONSHIP_name',
        type: 'RELATIONSHIP_PROPERTY_EXISTENCE',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['TEST_RELATIONSHIP'],
        properties: ['name'],
      },
      {
        name: 'SPNL_c_rpe_TEST_RELATIONSHIP_note',
        type: 'RELATIONSHIP_PROPERTY_EXISTENCE',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['TEST_RELATIONSHIP'],
        properties: ['note'],
      },
      {
        name: 'SPNL_c_u_TestNode_id',
        type: 'UNIQUENESS',
        entityType: 'NODE',
        labelsOrTypes: ['TestNode'],
        properties: ['id'],
      },
      {
        name: 'SPNL_c_u_TestNode_name',
        type: 'UNIQUENESS',
        entityType: 'NODE',
        labelsOrTypes: ['TestNode'],
        properties: ['name'],
      },
    ]);
  }

  async function assertIndexes() {
    const result = await neo4jFixture.getDriver().session().run('SHOW INDEXES');
    const indexDataList = result.records.map(
      (record) => record.toObject() as { name: string }
    );

    expect(indexDataList).toMatchObject([
      {
        name: 'SPNL_c_nk_TestNode_location_name',
        uniqueness: 'UNIQUE',
        type: 'BTREE',
        entityType: 'NODE',
        labelsOrTypes: ['TestNode'],
        properties: ['location', 'name'],
        indexProvider: 'native-btree-1.0',
      },
      {
        name: 'SPNL_c_u_TestNode_id',
        uniqueness: 'UNIQUE',
        type: 'BTREE',
        entityType: 'NODE',
        labelsOrTypes: ['TestNode'],
        properties: ['id'],
        indexProvider: 'native-btree-1.0',
      },
      {
        name: 'SPNL_c_u_TestNode_name',
        uniqueness: 'UNIQUE',
        type: 'BTREE',
        entityType: 'NODE',
        labelsOrTypes: ['TestNode'],
        properties: ['name'],
        indexProvider: 'native-btree-1.0',
      },
      {
        name: 'SPNL_i_r_bt_TEST_RELATIONSHIP_name',
        uniqueness: 'NONUNIQUE',
        type: 'BTREE',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['TEST_RELATIONSHIP'],
        properties: ['name'],
        indexProvider: 'native-btree-1.0',
      },
      {
        name: 'SPNL_i_r_t_TEST_RELATIONSHIP_note',
        uniqueness: 'NONUNIQUE',
        type: 'TEXT',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['TEST_RELATIONSHIP'],
        properties: ['note'],
        indexProvider: 'text-1.0',
      },
      {
        name: 'index_IndexTestNode_arbitrary_name',
        uniqueness: 'NONUNIQUE',
        type: 'FULLTEXT',
        entityType: 'NODE',
        labelsOrTypes: ['TestNode'],
        properties: ['name', 'desc'],
        indexProvider: 'fulltext-1.0',
      },
    ]);
  }
});
