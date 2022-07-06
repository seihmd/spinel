import { ParameterNameLiteral } from '../../../literal/parameter/ParameterNameLiteral';

describe(`${ParameterNameLiteral.name}`, () => {
  test('$', () => {
    const p = new ParameterNameLiteral('name');
    expect(p.$()).toBe('$name');
  });
});
