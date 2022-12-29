import { PatternFormula } from 'domain/graph/pattern/formula/PatternFormula';

describe(`${PatternFormula.name}`, () => {
  class Sut extends PatternFormula {
    constructor(value: string) {
      super(value);
    }

    getKey(): string | null {
      return this.formula;
    }

    protected getParseStartIndex(): 0 | 1 {
      return 0;
    }

    protected reverse(): PatternFormula {
      return new Sut(this.reverseFormula());
    }
  }

  test.each([
    ['(:User) - [:HAS_ITEM] -> item <- [:HAS_STOCK] - shop'],
    ['(:User)-[:HAS_ITEM]-item-[:HAS_STOCK]-shop'],
    [
      `(:User) - [:HAS_ITEM] -> item
     <- [:HAS_STOCK] - shop`,
    ],
    ['user'],
  ])('Constructor takes valid description string', (formula: string) => {
    expect(() => {
      new Sut(formula);
    }).not.toThrowError();
  });

  test.each([
    ['node <- [:HAS_STOCK] - node'],
    ['node1 - hasItem -> node2 <- hasItem - node3'],
    ['node1 <- dup - dup'],
  ])('Constructor throw exception when duplicate keys', (formula: string) => {
    expect(() => {
      new Sut(formula);
    }).toThrowError('Pattern has duplicate keys.');
  });

  test.each([
    ['(:User) - [:HAS_ITEM] -> (:User) <- [:HAS_STOCK] - user'],
    ['(:User) - [:HAS_ITEM] -> item <- [:HAS_ITEM] - shop'],
  ])(
    'Node label and Relationship Type are not counted as a duplicate',
    (formula: string) => {
      expect(() => {
        new Sut(formula);
      }).not.toThrowError();
    }
  );
});
