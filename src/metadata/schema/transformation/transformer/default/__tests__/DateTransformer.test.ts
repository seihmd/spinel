import { DateTransformer } from '../DateTransformer';
import { PlainDate } from '../../../plain/PlainDate';
import { Date as Neo4jDate } from 'neo4j-driver';

describe(`${DateTransformer.name}`, () => {
  const dateTransformer = new DateTransformer();

  test.each([
    [{ year: 2000, month: 1, day: 2 }, new Date('2000-01-02T00:00:00.000Z')],
    [null, null],
  ])('restore', (value: PlainDate | null, expected: unknown) => {
    expect(dateTransformer.restore(value)).toStrictEqual(expected);
  });

  test.each([
    [new Date('2000-01-02T00:00:00.000Z'), new Neo4jDate(2000, 1, 2)],
    [null, null],
  ])('preserve', (value: Date | null, expected: unknown) => {
    expect(dateTransformer.preserve(value)).toStrictEqual(expected);
  });
});
