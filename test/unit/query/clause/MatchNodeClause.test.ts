import { MatchNodeClause } from 'query/clause/MatchNodeClause';
import { NodeLiteral } from 'query/literal/NodeLiteral';
import { instance, mock, when } from 'ts-mockito';

describe('MatchNodeClause', () => {
  test('prepend match to pattern', () => {
    const nodeLiteralStub = mock(NodeLiteral);
    when(nodeLiteralStub.get()).thenReturn('(n)');
    const matchNodeClause = new MatchNodeClause(instance(nodeLiteralStub));

    expect(matchNodeClause.get()).toBe('MATCH (n)');
  });
});
