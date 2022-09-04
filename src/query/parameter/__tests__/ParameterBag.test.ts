import { Parameter } from '../Parameter';
import { ParameterBag } from '../ParameterBag';

describe(`${ParameterBag.name}`, () => {
  test.each([
    [[], {}],
    [[Parameter.new('p', 'v')], { p: 'v' }],
    [[Parameter.new('p', 'v'), Parameter.new('q', 'v2')], { p: 'v', q: 'v2' }],
    [
      [Parameter.new('p', 'v'), Parameter.new('q.r', 'v2')],
      { p: 'v', q: { r: 'v2' } },
    ],
  ])('toPlain', (parameters: Parameter[], expected: unknown) => {
    const parameterBag = new ParameterBag();
    parameters.forEach((parameter) => {
      parameterBag.add(parameter);
    });
    expect(parameterBag.toPlain()).toStrictEqual(expected);
  });
});
