import { PatternFormula } from '../../../../graph/pattern/formula/PatternFormula';

describe(`${PatternFormula.name}`, () => {
  test.each([
    [':User - :HAS_ITEM -> item <- :HAS_STOCK - shop'],
    [':User-:HAS_ITEM-item-:HAS_STOCK-shop'],
    [
      `:User - :HAS_ITEM -> item
     <- :HAS_STOCK - shop`,
    ],
  ])('Constructor takes valid description string', (formula: string) => {
    expect(() => {
      new PatternFormula(formula);
    }).not.toThrowError();
  });

  test.each([
    ['node <- :HAS_STOCK - node'],
    ['node1 - hasItem -> node2 <- hasItem - node3'],
    ['node1 <- dup - dup'],
  ])(
    'Constructor throw exception when duplicate keys',
    (description: string) => {
      expect(() => {
        new PatternFormula(description);
      }).toThrowError('Pattern has duplicate keys.');
    }
  );

  test.each([
    [':User - :HAS_ITEM -> :User <- :HAS_STOCK - user'],
    [':User - :HAS_ITEM -> item <- :HAS_ITEM - shop'],
  ])(
    'Node label and Relationship Type are not counted as a duplicate',
    (description: string) => {
      expect(() => {
        new PatternFormula(description);
      }).not.toThrowError();
    }
  );
});
