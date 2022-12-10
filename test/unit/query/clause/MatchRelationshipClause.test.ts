import { MatchRelationshipClause } from 'query/clause/MatchRelationshipClause';
import { RelationshipLiteral } from 'query/literal/RelationshipLiteral';
import { instance, mock, when } from 'ts-mockito';

describe('MatchRelationshipClause', () => {
  test('prepend match to pattern', () => {
    const relationshipLiteral = mock(RelationshipLiteral);
    when(relationshipLiteral.get()).thenReturn('[r]');
    const matchRelationshipClause = new MatchRelationshipClause(
      instance(relationshipLiteral)
    );

    expect(matchRelationshipClause.get()).toBe('MATCH ()-[r]-()');
  });
});
