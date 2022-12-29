import { DateTime } from 'neo4j-driver';
import { isRecord } from 'util/isRecord';

describe('isRecord', () => {
  test.each([
    [{}, true],
    [[], false],
    [new Date(), false],
    [Date, false],
    [new Map(), false],
    ['', false],
    [1, false],
    [null, false],
    [undefined, false],
    [DateTime.fromStandardDate(new Date()), false],
  ])(
    'returns true when value is Record',
    (value: unknown, expected: boolean) => {
      expect(isRecord(value)).toBe(expected);
    }
  );
});
