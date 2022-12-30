import { instance, mock } from 'ts-mockito';
import {
  Graph,
  GraphNode,
  NodeEntity,
  Primary,
  RelationshipEntity,
} from '../../../../../src';
import { Direction } from '../../../../../src/domain/graph/Direction';
import { ClassConstructor } from '../../../../../src/domain/type/ClassConstructor';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';
import { DetachQueryBuilder } from '../../../../../src/query/builder/detach/DetachQueryBuilder';
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
}

function newQb(
  node1: InstanceType<ClassConstructor<object>>,
  node2: InstanceType<ClassConstructor<object>>,
  relationship?: string | ClassConstructor<object> | null,
  direction?: Direction
): DetachQueryBuilder {
  return new DetachQueryBuilder(
    instance(mock(SessionProvider)),
    getMetadataStore(),
    node1,
    node2,
    relationship,
    direction
  );
}

describe('DetachQueryBuilder', () => {
  const testCases = [
    [
      newQb(new User('1'), new User('2')),
      'MATCH (n0:User{id:$n0.id})-[r]->(n4:User{id:$n4.id}) DELETE r',
      { n0: { id: '1' }, n4: { id: '2' } },
    ],
    [
      newQb(new User('1'), User),
      'MATCH (n0:User{id:$n0.id})-[r]->(n4:User) DELETE r',
      { n0: { id: '1' } },
    ],
    [
      newQb(User, new User('2')),
      'MATCH (n0:User)-[r]->(n4:User{id:$n4.id}) DELETE r',
      { n4: { id: '2' } },
    ],
    [newQb(User, User), 'MATCH (n0:User)-[r]->(n4:User) DELETE r', {}],
    [
      newQb(User, User, 'FOLLOWS'),
      'MATCH (n0:User)-[r2:FOLLOWS]->(n4:User) DELETE r2',
      {},
    ],
    [
      newQb(User, User, null, '<-'),
      'MATCH (n0:User)<-[r]-(n4:User) DELETE r',
      {},
    ],
    [
      newQb(User, User, null, '-'),
      'MATCH (n0:User)-[r]-(n4:User) DELETE r',
      {},
    ],
  ] as [DetachQueryBuilder, string, Record<string, any>][];

  test.each(testCases)(
    'build query',
    (
      qb: DetachQueryBuilder,
      expectedStatement: string,
      expectedParameters: Record<string, any>
    ) => {
      const q = qb.buildQuery();
      expect(q.getStatement()).toBe(expectedStatement);
      expect(q.getParameters()).toStrictEqual(expectedParameters);
    }
  );
});
