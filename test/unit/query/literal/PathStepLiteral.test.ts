import { NodeLiteral } from 'query/literal/NodeLiteral';
import { PathStepLiteral } from 'query/literal/PathStepLiteral';
import { RelationshipLiteral } from 'query/literal/RelationshipLiteral';
import { anything, instance, mock, when } from 'ts-mockito';

describe(`${PathStepLiteral.name}`, () => {
  test('get', () => {
    const relationshipLiteralStub = mock(RelationshipLiteral);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    when(relationshipLiteralStub.get(anything())).thenReturn('[r:FOLLOWS]');

    const nodeLiteralStub = mock(NodeLiteral);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    when(nodeLiteralStub.get(anything())).thenReturn('(n:User)');

    const pathStepLiteral = new PathStepLiteral(
      '-',
      instance(relationshipLiteralStub),
      '->',
      instance(nodeLiteralStub)
    );
    expect(pathStepLiteral.get()).toBe('-[r:FOLLOWS]->(n:User)');
  });
});
