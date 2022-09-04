import { Parameter } from '../Parameter';

describe(`${Parameter.name}`, () => {
  test.each([
    [Parameter.new('p', 'v'), { p: 'v' }],
    [Parameter.new('p.q', 'v'), { p: { q: 'v' } }],
  ])('toPlain', (parameter: Parameter, expected: unknown) => {
    expect(parameter.toPlain()).toStrictEqual(expected);
  });
});
