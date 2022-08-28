import { PositiveInt } from '../../type/PositiveInt';
import { PatternIndex } from '../../graph/pattern/term/PatternIndex';

describe(`${PositiveInt.name}`, () => {
  test.each([
    [10, true],
    [1, true],
    [0.1, false],
    [0, true],
    [-0.1, false],
    [-1, false],
  ])(
    'throw error with negative or float value',
    (value: number, isValid: boolean) => {
      const exp = expect(() => {
        new PatternIndex(value);
      });
      if (isValid) {
        exp.not.toThrowError();
      } else {
        exp.toThrowError();
      }
    }
  );
});
