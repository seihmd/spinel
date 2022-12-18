import { PositiveInt } from '../../../../src/domain/type/PositiveInt';
import { LimitClause } from '../../../../src/query/clause/LimitClause';

describe(`LimitClause`, () => {
  test('get', () => {
    expect(new LimitClause(new PositiveInt(1)).get()).toBe('LIMIT 1');
  });
});
