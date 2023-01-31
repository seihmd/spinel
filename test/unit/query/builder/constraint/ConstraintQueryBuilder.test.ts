import { instance, mock } from 'ts-mockito';
import {
  NodeEntity,
  Primary,
  Property,
  RelationshipEntity,
} from '../../../../../src';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';
import { ConstraintQueryBuilder } from '../../../../../src/query/builder/constraint/ConstraintQueryBuilder';
import { SessionProvider } from '../../../../../src/query/driver/SessionProvider';

@NodeEntity('User', {
  unique: ['name'],
  keys: [['name', 'address']],
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

@RelationshipEntity('FOLLOWS')
class Follows {
  @Primary() private id: string;

  @Property({ notNull: true })
  private name: string;

  @Property({ alias: 'note', notNull: true })
  private memo: string;
}

function newQb(existingConstraintNames: string[]): ConstraintQueryBuilder {
  return new ConstraintQueryBuilder(
    instance(mock(SessionProvider)),
    getMetadataStore().getAllConstraints(),
    existingConstraintNames
  );
}

describe('ConstraintQueryBuilder', () => {
  test('build query', () => {
    const qb = newQb([]);
    expect(qb.buildCreateQueries().map((q) => q.getStatement())).toStrictEqual([
      'CREATE CONSTRAINT SPNL_c_nk_User_location_name IF NOT EXISTS FOR (e:User) REQUIRE (e.location, e.name) IS NODE KEY',
      'CREATE CONSTRAINT SPNL_c_npe_User_id IF NOT EXISTS FOR (e:User) REQUIRE e.id IS NOT NULL',
      'CREATE CONSTRAINT SPNL_c_u_User_id IF NOT EXISTS FOR (e:User) REQUIRE e.id IS UNIQUE',
      'CREATE CONSTRAINT SPNL_c_u_User_name IF NOT EXISTS FOR (e:User) REQUIRE e.name IS UNIQUE',
      'CREATE CONSTRAINT SPNL_c_rpe_FOLLOWS_id IF NOT EXISTS FOR ()-[e:FOLLOWS]-() REQUIRE e.id IS NOT NULL',
      'CREATE CONSTRAINT SPNL_c_rpe_FOLLOWS_name IF NOT EXISTS FOR ()-[e:FOLLOWS]-() REQUIRE e.name IS NOT NULL',
      'CREATE CONSTRAINT SPNL_c_rpe_FOLLOWS_note IF NOT EXISTS FOR ()-[e:FOLLOWS]-() REQUIRE e.note IS NOT NULL',
    ]);
    expect(qb.buildDropQueries().map((q) => q.getStatement())).toStrictEqual(
      []
    );
  });

  test('if exists, not create it', () => {
    const qb = newQb([
      'SPNL_c_nk_User_location_name',
      'SPNL_c_npe_User_id',
      'SPNL_c_u_User_id',
      'SPNL_c_u_User_name',
      'SPNL_c_rpe_FOLLOWS_id',
      'SPNL_c_rpe_FOLLOWS_name',
      'SPNL_c_rpe_FOLLOWS_note',
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
      'SPNL_c_nk_User_location_name',
      'SPNL_c_npe_User_id',
      'SPNL_c_u_User_id',
      'SPNL_c_u_User_name',
      'SPNL_c_rpe_FOLLOWS_id',
      'SPNL_c_rpe_FOLLOWS_name',
      'SPNL_c_rpe_FOLLOWS_note',
      'existing_but_undefined',
    ]);
    expect(qb.buildCreateQueries().map((q) => q.getStatement())).toStrictEqual(
      []
    );
    expect(qb.buildDropQueries().map((q) => q.getStatement())).toStrictEqual([
      'DROP CONSTRAINT existing_but_undefined',
    ]);
  });
});
