import { WhereStatement } from '../../../../../../src/query/builder/find/where/WhereStatement';
import { VariableMap } from '../../../../../../src/query/literal/util/VariableMap';

describe('WhereStatement', () => {
  test('assign', () => {
    expect(
      new WhereStatement('user.id').assign(
        new VariableMap(new Map([['user', 'n']]))
      )
    ).toBe('n.id');
  });
});
