import { ReturnClause } from 'query/clause/ReturnClause';
import { MapLiteral } from 'query/literal/MapLiteral';
import { instance, mock, when } from 'ts-mockito';

describe(`${ReturnClause.name}`, () => {
  test.each([
    [['a'], 'RETURN a'],
    [[stubMapLiteral('{a:b}')], 'RETURN {a:b}'],
    [
      ['a', stubMapLiteral('{a:b}'), 'c', stubMapLiteral('{c:d}')],
      'RETURN a,{a:b},c,{c:d}',
    ],
  ])('get()', (variableNames: (string | MapLiteral)[], expected: string) => {
    const returnClause = new ReturnClause(variableNames);
    expect(returnClause.get()).toBe(expected);
  });
});

function stubMapLiteral(value: string): MapLiteral {
  const mapLiteralStub = mock(MapLiteral);
  when(mapLiteralStub.get()).thenReturn(value);
  return instance(mapLiteralStub);
}
