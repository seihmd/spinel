import { placeholder } from '../../literal/placeholder';

describe('placeholder', () => {
  test.each([
    ['{user}.id', { user: 'n0' }, 'n0.id'],
    ['({user})', { user: 'n0' }, '(n0)'],
    ['({user}:User)', { user: 'n0' }, '(n0:User)'],
    ['[{has}:HAS]', { has: 'r2' }, '[r2:HAS]'],
    ['{ user }', { user: 'n0' }, 'n0'],
    ['{*.item}.id', { '*.item': 'b0_n0' }, 'b0_n0.id'],
    [
      '{shop}.id = $shopId AND {*.item}.id = $itemId',
      { shop: 'n0', '*.item': 'b0_n0' },
      'n0.id = $shopId AND b0_n0.id = $itemId',
    ],
  ])(
    'replace braced',
    (
      query: string,
      parameters: { [key: string]: string },
      expected: string
    ) => {
      expect(placeholder(query, parameters)).toBe(expected);
    }
  );

  test('missing parameter', () => {
    expect(() => {
      placeholder('{user}', {});
    }).toThrowError('Missing value for user');
  });
});
