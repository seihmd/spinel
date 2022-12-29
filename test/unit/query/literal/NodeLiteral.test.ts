import { NodeLabel } from 'domain/node/NodeLabel';
import { NodeLiteral } from 'query/literal/NodeLiteral';
import { ParameterLiteral } from 'query/literal/ParameterLiteral';
import { instance, mock, when } from 'ts-mockito';

describe(`${NodeLiteral.name}`, () => {
  const parameterLiteralStub = mock(ParameterLiteral);
  when(parameterLiteralStub.get()).thenReturn('{id:$a.id}');
  const parameterLiteral = instance(parameterLiteralStub);

  test.each([
    ['n', new NodeLabel('User'), parameterLiteral, '(n:User{id:$a.id})'],
    ['n', null, parameterLiteral, '(n{id:$a.id})'],
    ['n', new NodeLabel('User'), null, '(n:User)'],
    ['n', null, null, '(n)'],
  ])(
    'get',
    (
      variableName: string,
      nodeLabel: NodeLabel | null,
      parameterLiteral: ParameterLiteral | null,
      expected: string
    ) => {
      const nodeLiteral = new NodeLiteral(
        variableName,
        nodeLabel,
        parameterLiteral
      );

      expect(nodeLiteral.get()).toBe(expected);
    }
  );
});
