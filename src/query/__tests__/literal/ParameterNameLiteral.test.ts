import { ParameterNameLiteral } from '../../literal/ParameterNameLiteral';

describe(`${ParameterNameLiteral.name}`, () => {
  test('$', () => {
    const p = new ParameterNameLiteral('name');
    expect(p.$()).toBe('$name');
  });
});
