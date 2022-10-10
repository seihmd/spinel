import { NodePropertyExistenceConstraint } from '../NodePropertyExistenceConstraint';
import { NodeLabel } from '../../../../../src/domain/node/NodeLabel';

describe(`${NodePropertyExistenceConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new NodePropertyExistenceConstraint(
        new NodeLabel('User'),
        'email'
      ).getName()
    ).toBe('SPNL-npe-User-email');
  });
});
