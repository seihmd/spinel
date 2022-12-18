import { WhereClause } from 'query/clause/WhereClause';

describe(`${WhereClause.name}`, () => {
  test('get', () => {
    expect(new WhereClause('n0.id = $id').get()).toBe('WHERE n0.id = $id');
  });
});
