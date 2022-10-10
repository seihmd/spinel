import { NodeKeyConstraint } from '../NodeKeyConstraint';
import { NodeLabel } from '../../../../../src/domain/node/NodeLabel';

describe(`${NodeKeyConstraint.name}`, () => {
  test.each([
    [new NodeLabel('User'), ['email'], 'SPNL-nk-User-email'],
    [new NodeLabel('User'), ['email', 'name'], 'SPNL-nk-User-email-name'],
  ])('withData', (label: NodeLabel, properties: string[], expected: string) => {
    expect(new NodeKeyConstraint(label, properties).getName()).toBe(expected);
  });
});
