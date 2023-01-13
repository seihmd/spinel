import { OrderByStatement } from '../../../../../../src/query/builder/find/orderBy/OrderByStatement';
import { VariableSyntaxTranslator } from '../../../../../../src/query/builder/find/statement/VariableSyntaxTranslator';

describe('OrderByStatement', () => {
  test('getStatement', () => {
    expect(
      new OrderByStatement('user.id', 'ASC').translate(
        new VariableSyntaxTranslator(new Map([['user', ['n', null]]]))
      )
    ).toBe('n.id');
  });
});
