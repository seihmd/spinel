import { NodeLabel } from 'domain/node/NodeLabel';

describe('NodeLabel', () => {
  test('when passing string, set it as value', () => {
    const label = new NodeLabel('TestType');

    expect(label.toString()).toBe('TestType');
  });

  test('label must be at least 1 character', () => {
    expect(() => new NodeLabel('')).toThrowError(
      'Node Label must be at least 1 character'
    );
  });
});
