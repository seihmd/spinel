import { instance, mock, when } from 'ts-mockito';
import { PathLiteral } from '../../literal/PathLiteral';
import { MatchPathClause } from '../../clause/MatchPathClause';

describe('MatchGraphClause', () => {
  test('prepend match to pattern', () => {
    const pathLiteralStub = mock(PathLiteral);
    when(pathLiteralStub.get()).thenReturn('(n)-[r]-(n2)');
    const matchPathClause = new MatchPathClause(instance(pathLiteralStub));

    expect(matchPathClause.get()).toBe('MATCH (n)-[r]-(n2)');
  });
});
