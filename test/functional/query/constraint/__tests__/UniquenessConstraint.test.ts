import { UniquenessConstraint } from '../UniquenessConstraint';
import { NodeLabel } from '../../../../../src/domain/node/NodeLabel';

describe(`${UniquenessConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new UniquenessConstraint(new NodeLabel('User'), 'email').getName()
    ).toBe('SPNL-u-User-email');
  });
});
