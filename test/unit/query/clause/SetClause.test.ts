import { SetClause } from 'query/clause/SetClause';
import { Parameter } from 'query/parameter/Parameter';

describe(`${SetClause.name}`, () => {
  test('get', () => {
    const setClause = new SetClause('val', Parameter.new('p', {}));

    expect(setClause.get()).toBe('SET val=$p');
  });
});
