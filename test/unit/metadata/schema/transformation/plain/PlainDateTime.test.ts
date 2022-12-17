import { instanceToPlain } from 'class-transformer';
import { PlainDateTime } from 'metadata/schema/transformation/plain/PlainDateTime';
import { DateTime } from 'neo4j-driver';

function normalizeNegZero(value: number): number {
  if (Object.is(value, -0)) {
    return 0;
  }
  return value;
}

describe(`PlainDateTime`, () => {
  test.each([
    [
      new DateTime(1, 2, 3, 4, 5, 6, 7, 100),
      {
        year: 1,
        month: 2,
        day: 3,
        hour: 4,
        minute: 5,
        second: 6,
        nanosecond: 7,
        timeZoneId: undefined,
        timeZoneOffsetSeconds: 100,
      },
    ],
    [
      new DateTime(1, 2, 3, 4, 5, 6, 7, undefined, 'Japan'),
      {
        year: 1,
        month: 2,
        day: 3,
        hour: 4,
        minute: 5,
        second: 6,
        nanosecond: 7,
        timeZoneId: 'Japan',
        timeZoneOffsetSeconds: undefined,
      },
    ],
    [
      new DateTime(1, 2, 3, 4, 5, 6, 7, 100, 'Japan'),
      {
        year: 1,
        month: 2,
        day: 3,
        hour: 4,
        minute: 5,
        second: 6,
        nanosecond: 7,
        timeZoneId: 'Japan',
        timeZoneOffsetSeconds: 100,
      },
    ],
    [
      new DateTime(1, 2, 3, 4, 5, 6, 7, 100, null),
      {
        year: 1,
        month: 2,
        day: 3,
        hour: 4,
        minute: 5,
        second: 6,
        nanosecond: 7,
        timeZoneId: undefined,
        timeZoneOffsetSeconds: 100,
      },
    ],
    [
      DateTime.fromStandardDate(new Date('2000-01-02T03:04:05.123456789')),
      {
        year: 2000,
        month: 1,
        day: 2,
        hour: 3,
        minute: 4,
        second: 5,
        nanosecond: 123000000,
        timeZoneId: undefined,
        timeZoneOffsetSeconds: normalizeNegZero(
          new Date().getTimezoneOffset() * -60
        ),
      },
    ],
    [
      DateTime.fromStandardDate(
        new Date('2000-01-02T03:04:05.123456789+00:00')
      ),
      {
        year: 2000,
        month: 1,
        day: 2,
        hour: 3 + new Date().getTimezoneOffset() / -60,
        minute: 4,
        second: 5,
        nanosecond: 123000000,
        timeZoneId: undefined,
        timeZoneOffsetSeconds: normalizeNegZero(
          new Date().getTimezoneOffset() * -60
        ),
      },
    ],
  ])(
    'verify instanceToPlain result',
    (date: DateTime<any>, expected: PlainDateTime) => {
      expect(instanceToPlain(date)).toStrictEqual(expected);
    }
  );
});
