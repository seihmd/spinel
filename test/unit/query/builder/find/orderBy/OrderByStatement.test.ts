import { OrderByStatement } from '../../../../../../src/query/builder/find/orderBy/OrderByStatement';
import { VariableMap } from '../../../../../../src/query/literal/util/VariableMap';

describe('OrderByStatement', () => {
  test('getStatement', () => {
    expect(
      new OrderByStatement('user.id', 'ASC').translate(
        new VariableMap(new Map([['user', 'n']]))
      )
    ).toBe('n.id');
  });
});
