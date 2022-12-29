import { AssociationPatternFormula } from 'domain/graph/pattern/formula/AssociationPatternFormula';

describe(`AssociationPatternFormula`, () => {
  test.each([['n'], ['n-[:R]->(:N)'], ['n-[:R]-.key'], ['(:N)-[:R]->.key']])(
    'Constructor takes valid description string',
    (formula: string) => {
      expect(() => {
        new AssociationPatternFormula(formula);
      }).not.toThrowError();
    }
  );

  test.each([
    ['n-r->.key', 'r', 2],
    ['n-[:R]-n2', 'n2', 4],
    ['n-[:R]-n2-[:R]->.key', 'n2', 4],
  ])(
    'cannot have key term except at the root',
    (formula: string, invalidTerm: string, index: number) => {
      expect(() => {
        new AssociationPatternFormula(formula);
      }).toThrowError(
        `AssociationPatternFormula has EntityKeyTerm "${invalidTerm}" at ${index}`
      );
    }
  );

  test.each([
    ['.key-[:R]->.key', '.key', 0],
    ['n-[:R]->.key-[:R]->.key', '.key', 4],
  ])(
    'cannot have branch end term except at the terminal',
    (formula: string, invalidTerm: string, index: number) => {
      expect(() => {
        new AssociationPatternFormula(formula);
      }).toThrowError(
        `AssociationPatternFormula has AssociationReferenceTerm "${invalidTerm}" at ${index}`
      );
    }
  );
});
