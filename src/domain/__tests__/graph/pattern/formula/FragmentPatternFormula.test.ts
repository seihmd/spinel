import { FragmentPatternFormula } from '../../../../graph/pattern/formula/FragmentPatternFormula';

describe(`${FragmentPatternFormula.name}`, () => {
  test.each([['-r->n2'], ['-:HAS_ITEM-item<-:HAS_STOCK-shop']])(
    'Constructor takes valid description string',
    (formula: string) => {
      expect(() => {
        new FragmentPatternFormula(formula);
      }).not.toThrowError();
    }
  );

  test('Constructor throw exception when formula not start with Direction', () => {
    expect(() => {
      new FragmentPatternFormula('n-r->n2');
    }).toThrowError();
  });
});
