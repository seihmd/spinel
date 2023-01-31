import { isConstructor } from 'util/isConstructor';

describe('isConstructor', () => {
  test.each([
    [function () {}, true],
    [class A {}, true],
    [Array, true],
    [Function, true],
    [new Function(), true],
    [String, true],
    [[], false],
    [undefined, false],
    [null, false],
    [1, false],
    [new Number(1), false],
    [Array.prototype, false],
    [Function.prototype, false],
    [() => {}, false],
  ])('verify Constructor', (value: unknown, expected: boolean) => {
    isConstructor(value);
    // expect(isConstructor(value)).toBe(expected);
    // if (expected) {
    //   expect(() => {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     const _ = {} instanceof value;
    //   }).not.toThrowError();
    // }
  });
});
