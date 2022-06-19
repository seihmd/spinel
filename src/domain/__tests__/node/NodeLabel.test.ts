import { NodeLabel } from '../../node/NodeLabel';

describe('NodeLabel', () => {
  test('when passing string, set it as value', () => {
    const label = new NodeLabel('TestType');

    expect(label.toString()).toBe('TestType');
  });

  test('when passing Constructor, set name as value', () => {
    class TestClass {}

    const label = new NodeLabel(TestClass);

    expect(label.toString()).toBe('TestClass');
  });

  test('label must be at least 1 character', () => {
    expect(() => new NodeLabel('')).toThrowError(
      'Node Label must be at least 1 character'
    );
  });
});
