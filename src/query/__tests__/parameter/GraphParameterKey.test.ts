import { GraphParameterKey } from '../../parameter/GraphParameterKey';

describe(`${GraphParameterKey.name}`, () => {
  test.each([
    ['a', true],
    ['a.b', true],
    ['a_$0', true],
    ['0', false],
    ['0a', false],
    ['.', false],
    ['.a', false],
    ['', false],
  ])('getRoot', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new GraphParameterKey(value);
    });
    if (isValid) {
      exp.not.toThrowError();
    } else {
      exp.toThrowError();
    }
  });

  test.each([
    ['a', null],
    ['a.b', 'a'],
    ['a.b.c', 'a'],
  ])('getRoot', (value: string, root: string | null) => {
    expect(new GraphParameterKey(value).getRoot()).toBe(root);
  });

  test.each([
    ['a.b', 'b'],
    ['a.b.c', 'b.c'],
  ])('getLeave', (value: string, leave: string | null) => {
    expect(new GraphParameterKey(value).getExceptRoot()).toBe(leave);
  });
});
