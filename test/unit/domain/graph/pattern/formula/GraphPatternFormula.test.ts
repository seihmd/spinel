import { GraphPatternFormula } from 'domain/graph/pattern/formula/GraphPatternFormula';

describe(`${GraphPatternFormula.name}`, () => {
  test.each([['n-r->n2'], ['n-:R-n2<-:R-:N']])(
    'Constructor takes valid description string',
    (formula: string) => {
      expect(() => {
        new GraphPatternFormula(formula);
      }).not.toThrowError();
    }
  );

  test('Constructor throw exception when formula not start with Direction', () => {
    expect(() => {
      new GraphPatternFormula('-r->n2');
    }).toThrowError();
  });
});
