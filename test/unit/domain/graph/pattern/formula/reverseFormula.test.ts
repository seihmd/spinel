import { reverseFormula } from 'domain/graph/pattern/formula/reverseFormula';

describe('reverseFormula', () => {
  test.each([
    ['n1', 0, 'n1'],
    ['n1-r->n2', 0, 'n2<-r-n1'],
    ['-r->n', 1, 'n<-r-'],
    ['<-r-n', 1, 'n-r->'],
  ] as [string, 0 | 1, string][])(
    'reverse formula',
    (formula: string, startIndex: 0 | 1, reversed: string) => {
      expect(reverseFormula(formula, startIndex)).toBe(reversed);
    }
  );
});
