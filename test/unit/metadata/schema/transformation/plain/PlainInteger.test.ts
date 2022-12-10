import { Integer } from 'neo4j-driver';
import { instanceToPlain } from 'class-transformer';
import { PlainInteger } from '../PlainInteger';

describe(`PlainInteger`, () => {
  test.each([
    [new Integer(1), { low: 1, high: 0 }],
    [new Integer(undefined, 2), { low: 0, high: 2 }],
    [
      new Integer(1, 2),
      {
        low: 1,
        high: 2,
      },
    ],
    [
      Integer.fromNumber(1),
      {
        low: 1,
        high: 0,
      },
    ],
    [
      Integer.fromNumber(1.23),
      {
        low: 1,
        high: 0,
      },
    ],
    [
      Integer.fromInt(123),
      {
        low: 123,
        high: 0,
      },
    ],
    [
      Integer.fromValue('123'),
      {
        low: 123,
        high: 0,
      },
    ],
    [
      Integer.fromValue(Number.MAX_SAFE_INTEGER),
      {
        low: -1,
        high: 2097151,
      },
    ],
    [
      Integer.fromValue(Number.MAX_SAFE_INTEGER + 1),
      {
        low: 0,
        high: 2097152,
      },
    ],
    [
      Integer.fromValue(Number.MIN_SAFE_INTEGER),
      {
        low: 1,
        high: -2097152,
      },
    ],
    [
      Integer.fromValue(Number.MIN_SAFE_INTEGER - 1),
      {
        low: 0,
        high: -2097152,
      },
    ],
  ])(
    'verify instanceToPlain result',
    (integer: Integer, expected: PlainInteger) => {
      expect(instanceToPlain(integer)).toStrictEqual(expected);
    }
  );
});
