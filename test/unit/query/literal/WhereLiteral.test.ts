import { NodeElement } from 'query/element/NodeElement';
import { WhereLiteral } from 'query/literal/WhereLiteral';
import { Path } from 'query/path/Path';
import { instance, mock, when } from 'ts-mockito';

function elementStub(variableName: string, graphKey: string): NodeElement {
  const elementStub = mock(NodeElement);
  when(elementStub.getVariableName()).thenReturn(variableName);
  when(elementStub.getGraphParameterKey()).thenReturn(graphKey);

  return instance(elementStub);
}

describe(`${WhereLiteral.name}`, () => {
  test('new', () => {
    const whereQuery = WhereLiteral.new(
      'user.id = $userId',
      new Path(elementStub('n0', 'user'), [])
    );

    expect(whereQuery.get()).toBe('n0.id = $userId');
  });
});
