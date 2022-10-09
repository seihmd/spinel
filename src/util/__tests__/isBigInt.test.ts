import { isBigInt } from '../isBigInt';

describe('isBigInt', () => {
  test.each([
    [Number.MIN_SAFE_INTEGER - 1, true],
    [Number.MIN_SAFE_INTEGER, false],
    [-1, false],
    [0, false],
    [1, false],
    [Number.MAX_SAFE_INTEGER, false],
    [Number.MAX_SAFE_INTEGER + 1, true],
  ])('verify Constructor', (value: number, expected: boolean) => {
    expect(isBigInt(value)).toBe(expected);
  });
});
