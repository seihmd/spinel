import { VariableMap } from 'query/literal/util/VariableMap';
import { assignVariables } from '../../../../../src/query/literal/util/assignVariables';

describe('assignVariables', () => {
  test('tes', () => {
    const reslt = assignVariables(
      'a or toLower(user.id) and [user] or (user:User) in "b" and \'c\' or "d" or \'e\'',
      // "a in 'b'",
      new VariableMap(new Map([['user', 'n0']]))
    );

    // console.log(reslt);
  });

  const testCases: [string, [string, string][], string][] = [
    // ['user.id', [['user', 'n0']], 'n0.id'],
    // ['(user)', [['user', 'n0']], '(n0)'],
    // ['(user:User)', [['user', 'n0']], '(n0:User)'],
    // ['[has:HAS]', [['has', 'r2']], '[r2:HAS]'],
    // ['user', [['user', 'n0']], 'n0'],
    // ['shopItems.item.id', [['shopItems.item', 'b0_n0']], 'b0_n0.id'],
    // ['toLower(user.id)', [['user', 'n0']], 'toLower(n0.id)'],
    [
      'not exists((n)<-[:HAS]-())',
      [['n', 'n0']],
      'not exists((n0)<-[:HAS]-())',
    ],
  ];

  test.each(testCases)(
    'replace variables',
    (statement: string, entries: [string, string][], expected: string) => {
      expect(
        assignVariables(statement, new VariableMap(new Map(entries)))
      ).toBe(expected);
    }
  );

  test('missing parameter', () => {
    expect(() => {
      assignVariables('{user}', new VariableMap(new Map()));
    }).toThrowError('Missing value for user');
  });
});
