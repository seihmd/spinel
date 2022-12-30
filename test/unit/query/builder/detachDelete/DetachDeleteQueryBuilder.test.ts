import { instance, mock } from 'ts-mockito';
import {
  Graph,
  GraphBranch,
  GraphNode,
  NodeEntity,
  Primary,
} from '../../../../../src';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';
import { DetachDeleteQueryBuilder } from '../../../../../src/query/builder/detachDelete/DetachDeleteQueryBuilder';
import { SessionProvider } from '../../../../../src/query/driver/SessionProvider';

@NodeEntity()
class User {
  @Primary()
  private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('user')
class Followers {
  @GraphNode()
  private user: User;

  @GraphBranch(User, 'user<-[:FOLLOWS]-.')
  private followers: User[];

  constructor(user: User, followers: User[]) {
    this.user = user;
    this.followers = followers;
  }
}

function newQb(element: object): DetachDeleteQueryBuilder {
  return new DetachDeleteQueryBuilder(
    instance(mock(SessionProvider)),
    getMetadataStore(),
    element
  );
}

describe('DetachDeleteQueryBuilder', () => {
  const testCases = [
    [
      newQb(new User('1')),
      'MATCH (n0:User{id:$n0.id}) DETACH DELETE n0',
      {
        n0: { id: '1' },
      },
    ],
    [
      newQb(new Followers(new User('1'), [])),
      'MATCH (n0:User{id:$n0.id}) CALL {WITH n0 DETACH DELETE n0} IN TRANSACTIONS',
      { n0: { id: '1' } },
    ],
    [
      newQb(new Followers(new User('1'), [new User('2')])),
      'MATCH (n0:User{id:$n0.id}) ' +
        'MATCH (b0_0_n4:User{id:$b0_0_n4.id}) ' +
        'CALL {WITH n0,b0_0_n4 ' +
        'DETACH DELETE n0 ' +
        'DETACH DELETE b0_0_n4} IN TRANSACTIONS',
      { n0: { id: '1' }, b0_0_n4: { id: '2' } },
    ],
    [
      newQb(new Followers(new User('1'), [new User('2'), new User('3')])),
      'MATCH (n0:User{id:$n0.id}) ' +
        'MATCH (b0_0_n4:User{id:$b0_0_n4.id}) ' +
        'MATCH (b0_1_n4:User{id:$b0_1_n4.id}) ' +
        'CALL {WITH n0,b0_0_n4,b0_1_n4 ' +
        'DETACH DELETE n0 ' +
        'DETACH DELETE b0_0_n4 ' +
        'DETACH DELETE b0_1_n4} IN TRANSACTIONS',
      { n0: { id: '1' }, b0_0_n4: { id: '2' }, b0_1_n4: { id: '3' } },
    ],
  ] as [DetachDeleteQueryBuilder, string, Record<string, any>][];

  test.each(testCases)(
    'build query',
    (
      qb: DetachDeleteQueryBuilder,
      expectedStatement: string,
      expectedParameters: Record<string, any>
    ) => {
      const q = qb.buildQuery();
      expect(q.getStatement()).toBe(expectedStatement);
      expect(q.getParameters()).toStrictEqual(expectedParameters);
    }
  );
});
