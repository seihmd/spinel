import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import { getMetadataStore } from 'metadata/store/MetadataStore';
import { IndexQueryPlan } from 'query/builder/index/IndexQueryPlan';
import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';

const neo4jFixture = Neo4jFixture.new();

describe('indexes', () => {
  beforeEach(async () => {
    await neo4jFixture.clearMeta();
  });

  afterEach(async () => {
    await neo4jFixture.teardown();
  });

  afterAll(async () => {
    await neo4jFixture.close();
  });

  @NodeEntity({
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
  class IndexTestNode {
    @Primary() private id: string;

    @Property()
    private name: string;

    @Property({ alias: 'desc' })
    private description: string;
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
  class IndexTestRelationship {
    @Primary() private id: string;

    @Property()
    private name: string;

    @Property({ alias: 'note' })
    private memo: string;
  }

  test('IndexQueryPlan.exec', async () => {
    const indexQueryPlan = new IndexQueryPlan(
      getMetadataStore(),
      neo4jFixture.getDriver()
    );
    await indexQueryPlan.exec(true, true);

    const result = await neo4jFixture.getDriver().session().run('SHOW INDEXES');
    const indexDataList = result.records.map(
      (record) => record.toObject() as { name: string }
    );

    expect(indexDataList).toMatchObject([
      {
        name: 'SPNL_i_n_bt_IndexTestNode_name',
        uniqueness: 'NONUNIQUE',
        type: 'BTREE',
        entityType: 'NODE',
        labelsOrTypes: ['IndexTestNode'],
        properties: ['name'],
        indexProvider: 'native-btree-1.0',
      },
      {
        name: 'SPNL_i_r_bt_INDEX_TEST_RELATIONSHIP_name',
        uniqueness: 'NONUNIQUE',
        type: 'BTREE',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['INDEX_TEST_RELATIONSHIP'],
        properties: ['name'],
        indexProvider: 'native-btree-1.0',
      },
      {
        name: 'SPNL_i_r_t_INDEX_TEST_RELATIONSHIP_note',
        uniqueness: 'NONUNIQUE',
        type: 'TEXT',
        entityType: 'RELATIONSHIP',
        labelsOrTypes: ['INDEX_TEST_RELATIONSHIP'],
        properties: ['note'],
        indexProvider: 'text-1.0',
      },
      {
        name: 'index_IndexTestNode_arbitrary_name',
        uniqueness: 'NONUNIQUE',
        type: 'FULLTEXT',
        entityType: 'NODE',
        labelsOrTypes: ['IndexTestNode'],
        properties: ['name', 'desc'],
        indexProvider: 'fulltext-1.0',
      },
    ]);
  });
});
