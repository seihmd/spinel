import { IntegerTransformer } from '../IntegerTransformer';
import { PlainInteger } from '../../../plain/PlainInteger';
import { Integer } from 'neo4j-driver';

describe(`${IntegerTransformer.name}`, () => {
  const integerTransformer = new IntegerTransformer();
  test.each([
    [{ low: 1, high: 0 }, 1],
    [{ low: 0, high: 2 }, 8589934592],
    [{ low: 1, high: 2 }, 8589934593],
    [null, null],
  ])('restore', (value: PlainInteger | null, expected: unknown) => {
    expect(integerTransformer.restore(value)).toStrictEqual(expected);
  });

  test.each([
    [1, Integer.fromValue(1)],
    [null, null],
  ])('preserve', (value: number | null, expected: unknown) => {
    expect(integerTransformer.preserve(value)).toStrictEqual(expected);
  });
});
