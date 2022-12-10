import { TransformationRules } from 'metadata/schema/transformation/TransformationRules';
import { ParameterLiteral } from 'query/literal/ParameterLiteral';
import {
  EntityParameter,
  PlainEntityParameter,
} from 'query/parameter/EntityParameter';

describe(`${ParameterLiteral.name}`, () => {
  test.each([
    [{}, ''],
    [{ s: 'string', n: 1, b: false }, '{s:$s,n:$n,b:$b}'],
  ])('get()', (value: PlainEntityParameter, expected: string) => {
    const p = new ParameterLiteral(
      EntityParameter.withPlain(value, null, new TransformationRules([]))
    );
    expect(p.get()).toBe(expected);
  });
});
