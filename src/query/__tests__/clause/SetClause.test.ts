import { SetClause } from '../../clause/SetClause';
import { Parameter } from '../../parameter/Parameter';

describe(`${SetClause.name}`, () => {
  test('get', () => {
    const setClause = new SetClause('val', Parameter.new('p', {}));

    expect(setClause.get()).toBe('SET val=$p');
  });
});
