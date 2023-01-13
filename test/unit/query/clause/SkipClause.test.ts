import { PositiveInt } from '../../../../src/domain/type/PositiveInt';
import { SkipClause } from '../../../../src/query/clause/SkipClause';

describe(`SkipClause`, () => {
  test('get', () => {
    expect(new SkipClause(new PositiveInt(1)).get()).toBe('SKIP 1');
  });
});
