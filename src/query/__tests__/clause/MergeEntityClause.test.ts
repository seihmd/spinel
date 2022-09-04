import { instance, mock, when } from 'ts-mockito';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { MergeEntityClause } from '../../clause/MergeEntityClause';

describe(`${MergeEntityClause.name}`, () => {
  test('get', () => {
    const nodeLiteralStub = mock(NodeLiteral);
    when(nodeLiteralStub.get()).thenReturn('(n)');
    const mergeEntityClause = new MergeEntityClause(instance(nodeLiteralStub));

    expect(mergeEntityClause.get()).toBe('MERGE (n)');
  });
});
