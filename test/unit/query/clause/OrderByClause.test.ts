import { OrderByClause } from 'query/clause/OrderByClause';
import { OrderByLiteral } from 'query/literal/OrderByLiteral';

describe(`${OrderByClause.name}`, () => {
  test.each([
    [[], ''],
    [[new OrderByLiteral('n.id', 'DESC')], 'ORDER BY n.id DESC'],
    [
      [new OrderByLiteral('n.id', 'DESC'), new OrderByLiteral('n.name', 'ASC')],
      'ORDER BY n.id DESC,n.name ASC',
    ],
  ])('get', (literals: OrderByLiteral[], expected: string) => {
    expect(new OrderByClause(literals).get()).toBe(expected);
  });
});
