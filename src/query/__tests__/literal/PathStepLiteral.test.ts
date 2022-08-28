import { PathStepLiteral } from '../../literal/PathStepLiteral';
import { instance, mock, when } from 'ts-mockito';
import { RelationshipLiteral } from '../../literal/RelationshipLiteral';
import { NodeLiteral } from '../../literal/NodeLiteral';

describe(`${PathStepLiteral.name}`, () => {
  test('get', () => {
    const relationshipLiteralStub = mock(RelationshipLiteral);
    when(relationshipLiteralStub.get()).thenReturn('[r:FOLLOWS]');

    const nodeLiteralStub = mock(NodeLiteral);
    when(nodeLiteralStub.get()).thenReturn('(n:User)');

    const pathStepLiteral = new PathStepLiteral(
      '-',
      instance(relationshipLiteralStub),
      '->',
      instance(nodeLiteralStub)
    );
    expect(pathStepLiteral.get()).toBe('-[r:FOLLOWS]->(n:User)');
  });
});
