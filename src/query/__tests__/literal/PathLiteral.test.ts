import { PathStepLiteral } from '../../literal/PathStepLiteral';
import { anything, instance, mock, when } from 'ts-mockito';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { PathLiteral } from '../../literal/PathLiteral';

describe(`${PathLiteral.name}`, () => {
  test.each([
    [
      '(n0:User)',
      ['-[r:FOLLOWS]->(n1:User)'],
      '(n0:User)-[r:FOLLOWS]->(n1:User)',
    ],
    [
      '(n0:User)',
      ['-[r:FOLLOWS]->(n1:User)', '-[r2:FOLLOWS]->(n2:User)'],
      '(n0:User)-[r:FOLLOWS]->(n1:User)-[r2:FOLLOWS]->(n2:User)',
    ],
  ])('get', (rootValue: string, stepValues: string[], expected: string) => {
    const pathStepLiteral = new PathLiteral(
      stubNodeLiteral(rootValue),
      stepValues.map((stepValue) => stubPathStepLiteral(stepValue))
    );
    expect(pathStepLiteral.get()).toBe(expected);
  });
});

function stubNodeLiteral(value: string): NodeLiteral {
  const nodeLiteralStub = mock(NodeLiteral);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  when(nodeLiteralStub.get(anything())).thenReturn(value);
  return instance(nodeLiteralStub);
}

function stubPathStepLiteral(value: string): PathStepLiteral {
  const pathStepLiteralStub = mock(PathStepLiteral);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  when(pathStepLiteralStub.get(anything())).thenReturn(value);
  return instance(pathStepLiteralStub);
}
