import { AssociationPatternFormula } from 'domain/graph/pattern/formula/AssociationPatternFormula';

describe(`${AssociationPatternFormula.name}`, () => {
  test.each([['n'], ['n-[:R]->(:N)'], ['n-[:R]-n.key'], ['(:N)-[:R]->n.key']])(
    'Constructor takes valid description string',
    (formula: string) => {
      expect(() => {
        new AssociationPatternFormula(formula);
      }).not.toThrowError();
    }
  );
});
