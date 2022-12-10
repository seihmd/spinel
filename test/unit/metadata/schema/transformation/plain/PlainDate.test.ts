import { Date as Neo4jDate } from 'neo4j-driver';
import { instanceToPlain } from 'class-transformer';
import { PlainDate } from '../PlainDate';

describe(`PlainDate`, () => {
  test.each([
    [new Neo4jDate(1, 2, 3), { year: 1, month: 2, day: 3 }],
    [
      Neo4jDate.fromStandardDate(new Date('2000-01-02 03:04:05')),
      { year: 2000, month: 1, day: 2 },
    ],
  ])(
    'verify instanceToPlain result',
    (date: Neo4jDate<any>, expected: PlainDate) => {
      expect(instanceToPlain(date)).toStrictEqual(expected);
    }
  );
});
