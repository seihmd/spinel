import { PatternIndex } from 'domain/graph/pattern/term/PatternIndex';

describe(`${PatternIndex.name}`, () => {
  test.each([[-1], [-0.1], [0.1]])(
    'throw error with negative or float value',
    (value: number) => {
      expect(() => {
        new PatternIndex(value);
      }).toThrowError();
    }
  );

  test.each([
    [0, true],
    [1, false],
    [2, false],
    [3, false],
    [4, true],
    [5, false],
    [6, false],
    [7, false],
    [8, true],
  ])('isNode', (index: number, expected: boolean) => {
    expect(new PatternIndex(index).isNode()).toBe(expected);
  });

  test.each([
    [0, false],
    [1, false],
    [2, true],
    [3, false],
    [4, false],
    [5, false],
    [6, true],
    [7, false],
    [8, false],
  ])('isRelationship', (index: number, expected: boolean) => {
    expect(new PatternIndex(index).isRelationship()).toBe(expected);
  });

  test.each([
    [0, false],
    [1, true],
    [2, false],
    [3, true],
    [4, false],
    [5, true],
    [6, false],
    [7, true],
    [8, false],
  ])('isDirection', (index: number, expected: boolean) => {
    expect(new PatternIndex(index).isDirection()).toBe(expected);
  });

  test.each([
    [0, false],
    [1, false],
    [2, false],
    [3, true],
    [4, false],
    [5, false],
    [6, false],
    [7, true],
    [8, false],
  ])('isDirection', (index: number, expected: boolean) => {
    expect(new PatternIndex(index).isBetweenRelationshipAndNode()).toBe(
      expected
    );
  });

  test.each([
    [0, false],
    [1, true],
    [2, false],
    [3, false],
    [4, false],
    [5, true],
    [6, false],
    [7, false],
    [8, false],
  ])('isDirection', (index: number, expected: boolean) => {
    expect(new PatternIndex(index).isBetweenNodeAndRelationship()).toBe(
      expected
    );
  });
});
