import { MatchPathClause } from 'query/clause/MatchPathClause';
import { PathLiteral } from 'query/literal/PathLiteral';
import { instance, mock, when } from 'ts-mockito';

describe('MatchGraphClause', () => {
  test('prepend match to pattern', () => {
    const pathLiteralStub = mock(PathLiteral);
    when(pathLiteralStub.get()).thenReturn('(n)-[r]-(n2)');
    const matchPathClause = new MatchPathClause(instance(pathLiteralStub));

    expect(matchPathClause.get()).toBe('MATCH (n)-[r]-(n2)');
  });
});
