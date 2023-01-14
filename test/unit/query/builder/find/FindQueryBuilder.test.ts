import { ClassConstructor } from 'class-transformer';
import { QueryResult, Result } from 'neo4j-driver';
import { instance, mock } from 'ts-mockito';
import {
  Graph,
  GraphBranch,
  GraphNode,
  NodeEntity,
  Primary,
  Property,
} from '../../../../../src';
import { Embeddable } from '../../../../../src/decorator/class/Embeddable';
import { Embed } from '../../../../../src/decorator/property/Embed';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';
import { FindQueryBuilder } from '../../../../../src/query/builder/find/FindQueryBuilder';
import { SessionProviderInterface } from '../../../../../src/query/driver/SessionProviderInterface';

class DummySessionProvider implements SessionProviderInterface {
  run(statement: string, parameters: unknown): Promise<QueryResult> {
    const resultStub = mock(Result);
    return Promise.resolve(instance(resultStub));
  }
}

@Embeddable()
class Profile {
  @Property()
  address: string;

  @Property({ alias: 'phone_number' })
  tel: string;
}

@NodeEntity()
class User {
  @Primary()
  private id: string;

  @Property({ alias: 'user_name' })
  private name: string;

  @Embed()
  private profile: Profile;

  @Embed({ prefix: 'second_' })
  private profile2: Profile;
}

@Graph('user')
class Followers {
  @GraphNode()
  private user: User;

  @GraphBranch(User, 'user<-[:FOLLOWS]-.')
  private followers: User[];
}

function newQb<T>(cstr: ClassConstructor<T>): FindQueryBuilder<T> {
  return new FindQueryBuilder(
    new DummySessionProvider(),
    getMetadataStore(),
    cstr
  );
}

describe('FindQueryBuilder', () => {
  const testCases = [
    [newQb(User), 'MATCH (n0:User) RETURN n0{.*} AS _'],
    [
      newQb(User).where('user.id = $id'),
      'MATCH (n0:User) WHERE n0.id = $id RETURN n0{.*} AS _',
    ],
    [
      newQb(User).where('user.name = $name'),
      'MATCH (n0:User) WHERE n0.user_name = $name RETURN n0{.*} AS _',
    ],
    [
      newQb(User).where('user.profile.address = $address'),
      'MATCH (n0:User) WHERE n0.address = $address RETURN n0{.*} AS _',
    ],
    [
      newQb(User).where('user.profile2.tel = $tel'),
      'MATCH (n0:User) WHERE n0.second_phone_number = $tel RETURN n0{.*} AS _',
    ],
    [
      newQb(User).orderBy('user.id', 'ASC'),
      'MATCH (n0:User) RETURN n0{.*} AS _ ORDER BY n0.id ASC',
    ],
    [newQb(User).limit(1), 'MATCH (n0:User) RETURN n0{.*} AS _ LIMIT 1'],
    [
      newQb(Followers).filterBranch('followers', '.id IN $followerIds'),
      'MATCH (n0:User) ' +
        'RETURN {user:n0{.*},followers:[(n0)<-[b0_r2:FOLLOWS]-(b0_n4:User) ' +
        'WHERE b0_n4.id IN $followerIds|b0_n4{.*}]} AS _',
    ],
  ] as [FindQueryBuilder<any>, string][];

  test.each(testCases)(
    'createQuery',
    (qb: FindQueryBuilder<any>, expected: string) => {
      expect(qb.buildQuery({}).getStatement()).toBe(expected);
    }
  );
});
