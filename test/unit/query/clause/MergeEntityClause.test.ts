import { MergeEntityClause } from 'query/clause/MergeEntityClause';
import { NodeLiteral } from 'query/literal/NodeLiteral';
import { instance, mock, when } from 'ts-mockito';

describe(`${MergeEntityClause.name}`, () => {
  test('get', () => {
    const nodeLiteralStub = mock(NodeLiteral);
    when(nodeLiteralStub.get()).thenReturn('(n)');
    const mergeEntityClause = new MergeEntityClause(instance(nodeLiteralStub));

    expect(mergeEntityClause.get()).toBe('MERGE (n)');
  });
});
