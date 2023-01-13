import { VariableSyntaxTranslator } from '../../../../../../src/query/builder/find/statement/VariableSyntaxTranslator';
import { WhereStatement } from '../../../../../../src/query/builder/find/where/WhereStatement';

describe('WhereStatement', () => {
  test('assign', () => {
    expect(
      new WhereStatement('user.id').translate(
        new VariableSyntaxTranslator(new Map([['user', ['n', null]]]))
      )
    ).toBe('n.id');
  });
});
