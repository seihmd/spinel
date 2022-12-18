import { BranchEndTerm } from 'domain/graph/pattern/term/BranchEndTerm';

describe(`${BranchEndTerm.name}`, () => {
  test.each([
    ['@', null],
    ['@.abc', 'abc'],
    ['@.abc.de', 'abc.de'],
  ])('getKey', (value: string, expected: string | null) => {
    expect(new BranchEndTerm(value).getKey()).toBe(expected);
  });

  test.each([[''], ['@.'], ['.'], ['a'], ['-'], ['->'], ['<-']])(
    'getKey',
    (value: string) => {
      expect(() => {
        new BranchEndTerm(value);
      }).toThrowError('Pattern has invalid value');
    }
  );
});
