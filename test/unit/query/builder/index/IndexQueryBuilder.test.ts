import { instance, mock } from 'ts-mockito';
import {
  NodeEntity,
  Primary,
  Property,
  RelationshipEntity,
} from '../../../../../src';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';

import { IndexQueryBuilder } from '../../../../../src/query/builder/index/IndexQueryBuilder';
import { SessionProvider } from '../../../../../src/query/driver/SessionProvider';

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
class User {
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
class Follows {
  @Primary() private id: string;

  @Property()
  private name: string;

  @Property({ alias: 'note' })
  private memo: string;
}

function newQb(existingIndexNames: string[]): IndexQueryBuilder {
  return new IndexQueryBuilder(
    instance(mock(SessionProvider)),
    getMetadataStore().getAllIndexes(),
    existingIndexNames
  );
}

describe('IndexQueryBuilder', () => {
  test('build query', () => {
    const qb = newQb([]);
    expect(qb.buildCreateQueries().map((q) => q.getStatement())).toStrictEqual([
      'CREATE INDEX SPNL_i_n_bt_User_name IF NOT EXISTS FOR (e:User) ON (e.name)',
      'CREATE fulltext INDEX index_IndexTestNode_arbitrary_name IF NOT EXISTS FOR (e:User) ON EACH [e.name, e.desc]',
      'CREATE INDEX SPNL_i_r_bt_FOLLOWS_name IF NOT EXISTS FOR ()-[e:FOLLOWS]-() ON (e.name)',
      "CREATE text INDEX SPNL_i_r_t_FOLLOWS_note IF NOT EXISTS FOR ()-[e:FOLLOWS]-() ON (e.note) OPTIONS {indexProvider: 'text-1.0'}",
    ]);
    expect(qb.buildDropQueries().map((q) => q.getStatement())).toStrictEqual(
      []
    );
  });

  test('if exists, not create it', () => {
    const qb = newQb([
      'SPNL_i_n_bt_User_name',
      'index_IndexTestNode_arbitrary_name',
      'SPNL_i_r_bt_FOLLOWS_name',
      'SPNL_i_r_t_FOLLOWS_note',
    ]);
    expect(qb.buildCreateQueries().map((q) => q.getStatement())).toStrictEqual(
      []
    );
    expect(qb.buildDropQueries().map((q) => q.getStatement())).toStrictEqual(
      []
    );
  });

  test('if exists and not create, drop it', () => {
    const qb = newQb([
      'SPNL_i_n_bt_User_name',
      'index_IndexTestNode_arbitrary_name',
      'SPNL_i_r_bt_FOLLOWS_name',
      'SPNL_i_r_t_FOLLOWS_note',
      'existing_but_undefined',
    ]);
    expect(qb.buildCreateQueries().map((q) => q.getStatement())).toStrictEqual(
      []
    );
    expect(qb.buildDropQueries().map((q) => q.getStatement())).toStrictEqual([
      'DROP INDEX existing_but_undefined',
    ]);
  });
});
