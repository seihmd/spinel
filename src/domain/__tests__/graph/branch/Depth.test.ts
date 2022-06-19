import { Depth } from '../../../graph/branch/Depth';

describe(`${Depth.name}`, () => {
  test.each([
    [2, true],
    [1, true],
    [1.0, true],
    [1.1, false],
    [0.9, false],
    [0, false],
    [-1, false],
  ])('must be integer >= 1', (value: number, isValid: boolean) => {
    const exp = expect(() => {
      new Depth(value);
    });
    if (isValid) {
      exp.not.toThrowError();
    } else {
      exp.toThrowError();
    }
  });
});
