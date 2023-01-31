import { instance, mock } from 'ts-mockito';
import {
  Graph,
  GraphNode,
  NodeEntity,
  Primary,
  RelationshipEntity,
} from '../../../../../src';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';
import { DeleteQueryBuilder } from '../../../../../src/query/builder/delete/DeleteQueryBuilder';
import { SessionProvider } from '../../../../../src/query/driver/SessionProvider';

@NodeEntity('User')
class User {
  @Primary()
  private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@RelationshipEntity('FOLLOWS')
class Follows {
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
}

function newQb(element: object): DeleteQueryBuilder {
  return new DeleteQueryBuilder(
    instance(mock(SessionProvider)),
    getMetadataStore(),
    element
  );
}

describe('DeleteQueryBuilder', () => {
  const testCases = [
    [
      newQb(new User('1')),
      'MATCH (n0:User{id:$n0.id}) DELETE n0',
      { n0: { id: '1' } },
    ],
    [
      newQb(new Follows('2')),
      'MATCH ()-[r0:FOLLOWS{id:$r0.id}]-() DELETE r0',
      { r0: { id: '2' } },
    ],
  ] as [DeleteQueryBuilder, string, Record<string, any>][];

  test.each(testCases)(
    'build query',
    (
      qb: DeleteQueryBuilder,
      expectedStatement: string,
      expectedParameters: Record<string, any>
    ) => {
      const q = qb.buildQuery();
      expect(q.getStatement()).toBe(expectedStatement);
      expect(q.getParameters()).toStrictEqual(expectedParameters);
    }
  );

  test('Graph is not supported', () => {
    expect(() => {
      newQb(new Followers()).buildQuery();
    }).toThrowError(
      '"Followers" is not registered as NodeEntity or RelationshipEntity'
    );
  });
});
