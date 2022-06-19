import { Alias } from '../../../schema/entity/Alias';

describe('Alias', () => {
  test.each([
    ['a', false],
    ['a1', false],
    ['1a', true],
    ['a-', true],
    [' ', true],
  ])('Alias', (value: string, expectError: boolean) => {
    const exp = expect(() => {
      new Alias(value);
    });
    if (expectError) {
      exp.toThrowError();
    } else {
      exp.not.toThrowError();
    }
  });
});
