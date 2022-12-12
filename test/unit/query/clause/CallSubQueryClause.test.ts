import { CallSubqueryClause } from '../../../../src/query/clause/CallSubqueryClause';

describe('CallSubQueryClause', () => {
  test.each([
    ['subquery', true, 'CALL {subquery} IN TRANSACTIONS'],
    ['subquery', false, 'CALL {subquery}'],
  ])('get', (subquery: string, inTransactions: boolean, expected: string) => {
    const clause = new CallSubqueryClause(subquery, inTransactions);
    expect(clause.get()).toBe(expected);
  });
});
