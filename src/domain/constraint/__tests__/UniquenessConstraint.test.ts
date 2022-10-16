import { UniquenessConstraint } from '../UniquenessConstraint';
import { NodeLabel } from '../../node/NodeLabel';

describe(`${UniquenessConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new UniquenessConstraint(new NodeLabel('User'), 'email').getName()
    ).toBe('SPNL_c_u_User_email');
  });
});
