import { NodePropertyExistenceConstraint } from 'domain/constraint/NodePropertyExistenceConstraint';
import { NodeLabel } from 'domain/node/NodeLabel';

describe(`${NodePropertyExistenceConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new NodePropertyExistenceConstraint(
        new NodeLabel('User'),
        'email'
      ).getName()
    ).toBe('SPNL_c_npe_User_email');
  });
});
