import { NodeKeyConstraint } from '../NodeKeyConstraint';
import { NodeLabel } from '../../../domain/node/NodeLabel';

describe(`${NodeKeyConstraint.name}`, () => {
  test.each([
    [new NodeLabel('User'), ['email'], 'SPNL_nk_User_email'],
    [new NodeLabel('User'), ['email', 'name'], 'SPNL_nk_User_email_name'],
    [new NodeLabel('User'), ['name', 'email'], 'SPNL_nk_User_email_name'],
  ])('withData', (label: NodeLabel, properties: string[], expected: string) => {
    expect(new NodeKeyConstraint(label, properties).getName()).toBe(expected);
  });
});
