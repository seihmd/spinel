import { ParameterNameLiteral } from 'query/literal/ParameterNameLiteral';

describe(`${ParameterNameLiteral.name}`, () => {
  test('$', () => {
    const p = new ParameterNameLiteral('name');
    expect(p.$()).toBe('$name');
  });
});
