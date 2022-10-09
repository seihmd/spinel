import { instance, mock, when } from 'ts-mockito';
import { NodeElement } from '../../element/NodeElement';
import { WhereLiteral } from '../../literal/WhereLiteral';
import { Path } from '../../path/Path';

function elementStub(variableName: string, graphKey: string): NodeElement {
  const elementStub = mock(NodeElement);
  when(elementStub.getVariableName()).thenReturn(variableName);
  when(elementStub.getGraphParameterKey()).thenReturn(graphKey);

  return instance(elementStub);
}

describe(`${WhereLiteral.name}`, () => {
  test('new', () => {
    const whereQuery = WhereLiteral.new(
      '{user}.id = $userId',
      new Path(elementStub('n0', 'user'), [])
    );

    expect(whereQuery.get()).toBe('n0.id = $userId');
  });

  test('get', () => {
    const whereLiteral = new WhereLiteral(
      '{shop}.id = $id AND {*.items}.id = $itemId',
      { shop: 'n0', '*.items': 'b0_n0' }
    );
    expect(whereLiteral.get()).toBe('n0.id = $id AND b0_n0.id = $itemId');
  });
});