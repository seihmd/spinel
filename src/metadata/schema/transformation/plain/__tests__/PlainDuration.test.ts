import { Duration, Integer } from 'neo4j-driver';
import { instanceToPlain } from 'class-transformer';
import { PlainDuration } from '../PlainDuration';

const int = (value: number) => Integer.fromValue(value);

describe(`PlainDuration`, () => {
  test.each([
    [
      new Duration(1, 2, 3, 4),
      {
        months: 1,
        days: 2,
        seconds: { high: 0, low: 3 },
        nanoseconds: { high: 0, low: 4 },
      },
    ],
    [
      new Duration(1.1, 2.1, 3.1, 4.1),
      {
        months: 1.1,
        days: 2.1,
        seconds: { high: 0, low: 3 },
        nanoseconds: { high: 0, low: 4 },
      },
    ],
    [
      new Duration(int(1), int(2), int(3), int(4)),
      {
        months: { high: 0, low: 1 },
        days: { high: 0, low: 2 },
        seconds: { high: 0, low: 3 },
        nanoseconds: { high: 0, low: 4 },
      },
    ],
  ])(
    'verify instanceToPlain result',
    (date: Duration<any>, expected: PlainDuration) => {
      expect(instanceToPlain(date)).toStrictEqual(expected);
    }
  );
});
