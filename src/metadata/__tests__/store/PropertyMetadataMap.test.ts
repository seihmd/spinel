import { PropertyMetadataMap } from '../../store/PropertyMetadataMap';

describe(`${PropertyMetadataMap.name}`, () => {
  class NodeClass {}

  test('get unregistered', () => {
    const p = new PropertyMetadataMap<string>();
    expect(p.get(NodeClass)).toBe(null);
  });

  test('update and get', () => {
    const p = new PropertyMetadataMap<string>();
    p.update(NodeClass, () => {
      return 'test';
    });
    expect(p.get(NodeClass)).toBe('test');
    expect(p.get(NodeClass)).toBe(null);
  });
});
