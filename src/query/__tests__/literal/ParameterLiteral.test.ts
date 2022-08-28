import { EntityParameter } from '../../parameter/EntityParameter';
import { ParameterLiteral } from '../../literal/ParameterLiteral';
import { EntityParameterType } from '../../parameter/ParameterType';

describe(`${ParameterLiteral.name}`, () => {
  test.each([
    [{}, ''],
    [{ s: 'string', n: 1, b: false }, '{s:$name.s,n:$name.n,b:$name.b}'],
  ])('get()', (value: EntityParameterType, expected: string) => {
    const p = new ParameterLiteral('name', new EntityParameter(value));
    expect(p.get()).toBe(expected);
  });
});
