import { NodePropertyExistenceConstraint } from '../NodePropertyExistenceConstraint';
import { NodeLabel } from '../../../domain/node/NodeLabel';

describe(`${NodePropertyExistenceConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new NodePropertyExistenceConstraint(
        new NodeLabel('User'),
        'email'
      ).getName()
    ).toBe('SPNL_npe_User_email');
  });
});
