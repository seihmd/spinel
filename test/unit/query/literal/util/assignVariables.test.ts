import { VariableMap } from 'query/literal/util/VariableMap';
import { assignVariables } from '../../../../../src/query/literal/util/assignVariables';

describe('assignVariables', () => {
  const testCases: [string, Record<string, string>, string][] = [
    // plain variable
    ['a', { a: 'n0' }, 'n0'],
    ['abc', { abc: 'n0' }, 'n0'],
    ['abc.d', { abc: 'n0' }, 'n0.d'],
    ['abc.def', { abc: 'n0' }, 'n0.def'],
    ['abc.def', { abc: 'n0', 'abc.def': 'n4' }, 'n4'],
    ['abc.def.ghi', { abc: 'n0' }, 'abc.def.ghi'], // should throw err?
    ['abc.def.ghi', { abc: 'n0', 'abc.def': 'n4' }, 'n4.ghi'],
    ['abc.def.ghi', { abc: 'n0', 'abc.def': 'n4', 'abc.def.ghi': 'n8' }, 'n8'],
    // (variable)
    ['(a)', { a: 'n0' }, '(n0)'],
    ['(abc)', { abc: 'n0' }, '(n0)'],
    ['(abc.d)', { abc: 'n0' }, '(n0.d)'],
    ['(abc.def)', { abc: 'n0' }, '(n0.def)'],
    ['(abc.def)', { abc: 'n0', 'abc.def': 'n4' }, '(n4)'],
    ['(abc.def.ghi)', { abc: 'n0' }, '(abc.def.ghi)'], // should throw err?
    ['(abc.def.ghi)', { abc: 'n0', 'abc.def': 'n4' }, '(n4.ghi)'],
    [
      '(abc.def.ghi)',
      { abc: 'n0', 'abc.def': 'n4', 'abc.def.ghi': 'n8' },
      '(n8)',
    ],
    // (variable:LABEL)
    ['(a:a)', { a: 'n0' }, '(n0:a)'],
    ['(abc:abc)', { abc: 'n0' }, '(n0:abc)'],
    ['(abc.d:abc)', { abc: 'n0' }, '(n0.d:abc)'],
    ['(abc.def:abc)', { abc: 'n0' }, '(n0.def:abc)'],
    ['(abc.def:abc)', { abc: 'n0', 'abc.def': 'n4' }, '(n4:abc)'],
    ['(abc.def.ghi:abc)', { abc: 'n0' }, '(abc.def.ghi:abc)'], // should throw err?
    ['(abc.def.ghi:abc)', { abc: 'n0', 'abc.def': 'n4' }, '(n4.ghi:abc)'],
    [
      '(abc.def.ghi:abc)',
      { abc: 'n0', 'abc.def': 'n4', 'abc.def.ghi': 'n8' },
      '(n8:abc)',
    ],
    // [variable]
    ['[a]', { a: 'n0' }, '[n0]'],
    ['[abc]', { abc: 'n0' }, '[n0]'],
    ['[abc.d]', { abc: 'n0' }, '[n0.d]'],
    ['[abc.def]', { abc: 'n0' }, '[n0.def]'],
    ['[abc.def]', { abc: 'n0', 'abc.def': 'n4' }, '[n4]'],
    ['[abc.def.ghi]', { abc: 'n0' }, '[abc.def.ghi]'], // should throw err?
    ['[abc.def.ghi]', { abc: 'n0', 'abc.def': 'n4' }, '[n4.ghi]'],
    [
      '[abc.def.ghi]',
      { abc: 'n0', 'abc.def': 'n4', 'abc.def.ghi': 'n8' },
      '[n8]',
    ],
    // variable[x]
    ['a[x]', { a: 'n0' }, 'n0[x]'],
    ['abc[x]', { abc: 'n0' }, 'n0[x]'],
    ['abc.d[x]', { abc: 'n0' }, 'n0.d[x]'],
    ['abc.def[x]', { abc: 'n0' }, 'n0.def[x]'],
    ['abc.def[x]', { abc: 'n0', 'abc.def': 'n4' }, 'n4[x]'],
    ['abc.def.ghi[x]', { abc: 'n0' }, 'abc.def.ghi[x]'],
    ['abc.def.ghi[x]', { abc: 'n0', 'abc.def': 'n4' }, 'n4.ghi[x]'],
    [
      'abc.def.ghi[x]',
      { abc: 'n0', 'abc.def': 'n4', 'abc.def.ghi': 'n8' },
      'n8[x]',
    ],
    // [variable:TYPE]
    ['[a:a]', { a: 'n0' }, '[n0:a]'],
    ['[abc:abc]', { abc: 'n0' }, '[n0:abc]'],
    ['[abc.d:abc]', { abc: 'n0' }, '[n0.d:abc]'],
    ['[abc.def:abc]', { abc: 'n0' }, '[n0.def:abc]'],
    ['[abc.def:abc]', { abc: 'n0', 'abc.def': 'n4' }, '[n4:abc]'],
    ['[abc.def.ghi:abc]', { abc: 'n0' }, '[abc.def.ghi:abc]'], // should throw err?
    ['[abc.def.ghi:abc]', { abc: 'n0', 'abc.def': 'n4' }, '[n4.ghi:abc]'],
    [
      '[abc.def.ghi:abc]',
      { abc: 'n0', 'abc.def': 'n4', 'abc.def.ghi': 'n8' },
      '[n8:abc]',
    ],
    // function(variable)
    ['a(a:a)', { a: 'n0' }, 'a(n0:a)'],
    ['abc(abc:abc)', { abc: 'n0' }, 'abc(n0:abc)'],
    ['abc(abc.d:abc)', { abc: 'n0' }, 'abc(n0.d:abc)'],
    ['abc(abc.def:abc)', { abc: 'n0' }, 'abc(n0.def:abc)'],
    ['abc(abc.def:abc)', { abc: 'n0', 'abc.def': 'n4' }, 'abc(n4:abc)'],
    ['abc(abc.def.ghi:abc)', { abc: 'n0' }, 'abc(abc.def.ghi:abc)'], // should throw err?
    ['abc(abc.def.ghi:abc)', { abc: 'n0', 'abc.def': 'n4' }, 'abc(n4.ghi:abc)'],
    [
      'abc(abc.def.ghi:abc)',
      { abc: 'n0', 'abc.def': 'n4', 'abc.def.ghi': 'n8' },
      'abc(n8:abc)',
    ],
    // misc.
    ['a = "a"', { a: 'n0' }, 'n0 = "a"'],
    ["a = 'a'", { a: 'n0' }, "n0 = 'a'"],
    ['a and b and c', { a: 'b', b: 'c', c: 'a' }, 'b and c and a'],
    [
      'not exists((n)<-[r:HAS]-(n2:User))',
      { n: 'n0', r: 'r2', n2: 'n4' },
      'not exists((n0)<-[r2:HAS]-(n4:User))',
    ],
    ['n[function(propname)] < 1', { n: 'n0' }, 'n0[function(propname)] < 1'],
    ['abc and ABC', { ABC: 'n0' }, 'abc and n0'],
  ];

  test.each(testCases)(
    'replace variables',
    (statement: string, entries: Record<string, string>, expected: string) => {
      expect(
        assignVariables(
          statement,
          new VariableMap(new Map(Object.entries(entries)))
        )
      ).toBe(expected);
    }
  );
});
