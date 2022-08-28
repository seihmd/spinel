import { Depth } from '../../../graph/branch/Depth';

describe(`${Depth.name}`, () => {
  test.each([
    [2, true],
    [1, true],
    [1.0, true],
    [1.1, false],
    [0.9, false],
    [0, true],
    [-1, false],
  ])('must be integer >= 0', (level: number, isValid: boolean) => {
    const exp = expect(() => {
      new Depth(level);
    });
    if (isValid) {
      exp.not.toThrowError();
    } else {
      exp.toThrowError();
    }
  });

  test.each([
    [2, true],
    [1, true],
    [0, false],
  ])('canReduce', (level: number, expected: boolean) => {
    expect(new Depth(level).canReduce()).toBe(expected);
  });

  test.each([
    [2, 1],
    [1, 0],
  ])('reduce', (level: number, expected: number) => {
    expect(new Depth(level).reduce()).toEqual(new Depth(expected));
  });

  test('cannot reduce below 0', () => {
    expect(() => {
      new Depth(0).reduce();
    }).toThrowError('Depth cannot be reduced < 0');
  });
});
