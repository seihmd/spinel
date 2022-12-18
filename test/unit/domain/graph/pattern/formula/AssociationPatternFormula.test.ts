import { AssociationPatternFormula } from 'domain/graph/pattern/formula/AssociationPatternFormula';

describe(`${AssociationPatternFormula.name}`, () => {
  test.each([['n'], ['n-:R->:N'], ['n-:R-@'], [':N-:R->@.key']])(
    'Constructor takes valid description string',
    (formula: string) => {
      expect(() => {
        new AssociationPatternFormula(formula);
      }).not.toThrowError();
    }
  );

  test.each([['n-r->n2'], ['n-:R-n2-:R->n3']])(
    'cannot have key term except at the root',
    (formula: string) => {
      expect(() => {
        new AssociationPatternFormula(formula);
      }).toThrowError(
        'AssociationPatternFormula must have no key except at the root'
      );
    }
  );

  test.each([['@'], ['@-:R->@'], ['n-:R->@-:R->@']])(
    'cannot have branch end term except at the terminal',
    (formula: string) => {
      expect(() => {
        new AssociationPatternFormula(formula);
      }).toThrowError(
        'AssociationPatternFormula must have no branchEnd except at the terminal'
      );
    }
  );
});
