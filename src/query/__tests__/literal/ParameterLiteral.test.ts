import {
  EntityParameter,
  PlainEntityParameter,
} from '../../parameter/EntityParameter';
import { ParameterLiteral } from '../../literal/ParameterLiteral';

describe(`${ParameterLiteral.name}`, () => {
  test.each([
    [{}, ''],
    [{ s: 'string', n: 1, b: false }, '{s:$s,n:$n,b:$b}'],
  ])('get()', (value: PlainEntityParameter, expected: string) => {
    const p = new ParameterLiteral(EntityParameter.withPlain(value, null));
    expect(p.get()).toBe(expected);
  });
});
