import { ClassConstructor } from 'class-transformer';
import { instance, mock } from 'ts-mockito';
import {
  Graph,
  GraphBranch,
  GraphNode,
  NodeEntity,
  Primary,
} from '../../../../../src';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';
import { FindOneQueryBuilder } from '../../../../../src/query/builder/findOne/FindOneQueryBuilder';
import { SessionProvider } from '../../../../../src/query/driver/SessionProvider';

@NodeEntity()
class User {
  @Primary()
  private id: string;
}

@Graph('user')
class Followers {
  @GraphNode()
  private user: User;

  @GraphBranch(User, 'user<-[:FOLLOWS]-.')
  private followers: User[];
}

function newQb<T>(cstr: ClassConstructor<T>): FindOneQueryBuilder<T> {
  const sessionProviderDummy = mock(SessionProvider);
  return new FindOneQueryBuilder(
    instance(sessionProviderDummy),
    getMetadataStore(),
    cstr
  );
}

describe('FindOneQueryBuilder', () => {
  const testCases = [
    [newQb(User), 'MATCH (n0:User) RETURN n0{.*} AS _'],
    [
      newQb(User).where('user.id = $id'),
      'MATCH (n0:User) WHERE n0.id = $id RETURN n0{.*} AS _',
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
  ] as [FindOneQueryBuilder<any>, string][];

  test.each(testCases)(
    'build query',
    (qb: FindOneQueryBuilder<any>, expected: string) => {
      expect(qb.buildQuery({}).getStatement()).toBe(expected);
    }
  );
});
