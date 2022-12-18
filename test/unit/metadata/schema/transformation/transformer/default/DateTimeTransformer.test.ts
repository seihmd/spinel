import { PlainDateTime } from 'metadata/schema/transformation/plain/PlainDateTime';
import { DateTimeTransformer } from 'metadata/schema/transformation/transformer/default/DateTimeTransformer';
import { DateTime } from 'neo4j-driver';

function normalizeNegZero(value: number): number {
  if (Object.is(value, -0)) {
    return 0;
  }
  return value;
}

describe(`${DateTimeTransformer.name}`, () => {
  const dateTimeTransformer = new DateTimeTransformer();

  test.each([
    [
      {
        year: 2000,
        month: 1,
        day: 2,
        hour: 3,
        minute: 4,
        second: 5,
        nanosecond: 6,
        timeZoneId: undefined,
        timeZoneOffsetSeconds: 0,
      },
      new Date('2000-01-02T03:04:05.000Z'),
    ],
    [
      {
        year: 2000,
        month: 1,
        day: 2,
        hour: 3,
        minute: 4,
        second: 5,
        nanosecond: 6,
        timeZoneId: 'Japan',
        timeZoneOffsetSeconds: 0,
      },
      new Date('2000-01-02T03:04:05.000Z'),
    ],
    [
      {
        year: 2000,
        month: 1,
        day: 2,
        hour: 3,
        minute: 4,
        second: 5,
        nanosecond: 6,
        timeZoneId: 'Japan',
        timeZoneOffsetSeconds: -60,
      },
      new Date('2000-01-02T03:05:05.000Z'),
    ],

    [
      {
        year: 2000,
        month: 1,
        day: 2,
        hour: 3,
        minute: 4,
        second: 5,
        nanosecond: 6,
        timeZoneId: undefined,
        timeZoneOffsetSeconds: 60,
      },
      new Date('2000-01-02T03:03:05.000Z'),
    ],
    [null, null],
  ])('restore', (value: PlainDateTime | null, expected: unknown) => {
    expect(dateTimeTransformer.restore(value)).toStrictEqual(expected);
  });

  test.each([
    [
      new Date(2000, 0, 2, 3, 4, 5, 6),
      new DateTime(
        2000,
        1,
        2,
        3,
        4,
        5,
        6000000,
        normalizeNegZero(new Date().getTimezoneOffset() * -60)
      ),
    ],
    [
      new Date('2000-01-02T03:04:05.006'),
      new DateTime(
        2000,
        1,
        2,
        new Date('2000-01-02T03:04:05.006').getHours(),
        4,
        5,
        6000000,
        normalizeNegZero(new Date().getTimezoneOffset() * -60)
      ),
    ],
    [null, null],
  ])('preserve', (value: Date | null, expected: unknown) => {
    expect(dateTimeTransformer.preserve(value)).toStrictEqual(expected);
  });
});
