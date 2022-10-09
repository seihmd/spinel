import { PlainInteger } from '../../../plain/PlainInteger';
import { Integer } from 'neo4j-driver';
import { NumberTransformer } from '../NumberTransformer';

describe(`${NumberTransformer.name}`, () => {
  const numberTransformer = new NumberTransformer();
  test.each([
    [1, 1],
    [{ low: 1, high: 0 }, 1],
    [{ low: 0, high: 2 }, 8589934592],
    [{ low: 1, high: 2 }, 8589934593],
    [null, null],
  ])('restore', (value: PlainInteger | number | null, expected: unknown) => {
    expect(numberTransformer.restore(value)).toStrictEqual(expected);
  });

  test.each([
    [1, Integer.fromValue(1)],
    [1.0, Integer.fromValue(1)],
    [1.1, 1.1],
    [null, null],
  ])('preserve', (value: number | null, expected: unknown) => {
    expect(numberTransformer.preserve(value)).toStrictEqual(expected);
  });
});
