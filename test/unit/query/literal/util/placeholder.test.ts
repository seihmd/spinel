import { placeholder } from 'query/literal/util/placeholder';
import { VariableMap } from 'query/literal/util/VariableMap';

describe('placeholder', () => {
  test.each([
    ['{user}.id', new Map([['user', 'n0']]), 'n0.id'],
    ['({user})', new Map([['user', 'n0']]), '(n0)'],
    ['({user}:User)', new Map([['user', 'n0']]), '(n0:User)'],
    ['[{has}:HAS]', new Map([['has', 'r2']]), '[r2:HAS]'],
    ['{ user }', new Map([['user', 'n0']]), 'n0'],
    ['{*.item}.id', new Map([['*.item', 'b0_n0']]), 'b0_n0.id'],
    [
      '{shop}.id = $shopId AND {*.item}.id = $itemId',
      new Map([
        ['shop', 'n0'],
        ['*.item', 'b0_n0'],
      ]),
      'n0.id = $shopId AND b0_n0.id = $itemId',
    ],
  ])(
    'replace braced',
    (query: string, variableMap: Map<string, string>, expected: string) => {
      expect(placeholder(query, new VariableMap(variableMap))).toBe(expected);
    }
  );

  test('missing parameter', () => {
    expect(() => {
      placeholder('{user}', new VariableMap(new Map()));
    }).toThrowError('Missing value for user');
  });
});
