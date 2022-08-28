import { instance, mock, when } from 'ts-mockito';
import { MatchRelationshipClause } from '../../clause/MatchRelationshipClause';
import { RelationshipLiteral } from '../../literal/RelationshipLiteral';

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
