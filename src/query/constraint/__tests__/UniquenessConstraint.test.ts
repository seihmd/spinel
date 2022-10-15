import { UniquenessConstraint } from '../UniquenessConstraint';
import { NodeLabel } from '../../../domain/node/NodeLabel';

describe(`${UniquenessConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new UniquenessConstraint(new NodeLabel('User'), 'email').getName()
    ).toBe('SPNL_u_User_email');
  });
});
