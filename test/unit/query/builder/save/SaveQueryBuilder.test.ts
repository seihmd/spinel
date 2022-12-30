import { instance, mock } from 'ts-mockito';
import {
  Graph,
  GraphBranch,
  GraphNode,
  NodeEntity,
  Primary,
  RelationshipEntity,
} from '../../../../../src';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';
import { SaveQueryBuilder } from '../../../../../src/query/builder/save/SaveQueryBuilder';
import { SessionProvider } from '../../../../../src/query/driver/SessionProvider';

@NodeEntity()
class User {
  @Primary()
  private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@RelationshipEntity()
class Follows {
  @Primary()
  private id: string;
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

function newQb(element: object): SaveQueryBuilder {
  return new SaveQueryBuilder(
    instance(mock(SessionProvider)),
    getMetadataStore(),
    element
  );
}

describe('SaveQueryBuilder', () => {
  const testCases = [
    [
      newQb(new User('1')),
      'MERGE (n0:User{id:$n0.id}) SET n0=$n0',
      { n0: { id: '1' } },
    ],
    [
      newQb(new Followers(new User('1'), [])),
      'MERGE (n0:User{id:$n0.id}) SET n0=$n0',
      { n0: { id: '1' } },
    ],
    [
      newQb(new Followers(new User('1'), [new User('2')])),
      'MERGE (n0:User{id:$n0.id}) ' +
        'MERGE (b0_0_n4:User{id:$b0_0_n4.id}) ' +
        'MERGE (n0)<-[b0_0_r2:FOLLOWS]-(b0_0_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4',
      { n0: { id: '1' }, b0_0_n4: { id: '2' } },
    ],
    [
      newQb(new Followers(new User('1'), [new User('2'), new User('3')])),
      'MERGE (n0:User{id:$n0.id}) ' +
        'MERGE (b0_0_n4:User{id:$b0_0_n4.id}) ' +
        'MERGE (b0_1_n4:User{id:$b0_1_n4.id}) ' +
        'MERGE (n0)<-[b0_0_r2:FOLLOWS]-(b0_0_n4) ' +
        'MERGE (n0)<-[b0_1_r2:FOLLOWS]-(b0_1_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_1_n4=$b0_1_n4',
      {
        n0: {
          id: '1',
        },
        b0_0_n4: {
          id: '2',
        },
        b0_1_n4: {
          id: '3',
        },
      },
    ],
  ] as [SaveQueryBuilder, string, Record<string, any>][];

  test.each(testCases)(
    'build query',
    (
      qb: SaveQueryBuilder,
      expectedStatement: string,
      expectedParameters: Record<string, any>
    ) => {
      const q = qb.buildQuery();
      expect(q.getStatement()).toBe(expectedStatement);
      expect(q.getParameters()).toStrictEqual(expectedParameters);
    }
  );

  test('Relationship is not supported', () => {
    expect(() => {
      newQb(new Follows()).buildQuery();
    }).toThrowError('Relationship instance cannot be saved alone');
  });
});
