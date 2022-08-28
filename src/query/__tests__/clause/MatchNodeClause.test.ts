import { instance, mock, when } from 'ts-mockito';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { NodeLiteral } from '../../literal/NodeLiteral';

describe('MatchNodeClause', () => {
  test('prepend match to pattern', () => {
    const nodeLiteralStub = mock(NodeLiteral);
    when(nodeLiteralStub.get()).thenReturn('(n)');
    const matchNodeClause = new MatchNodeClause(instance(nodeLiteralStub));

    expect(matchNodeClause.get()).toBe('MATCH (n)');
  });
});
