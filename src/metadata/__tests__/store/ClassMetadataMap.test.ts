import { ClassMetadataMap } from '../../store/ClassMetadataMap';

describe(`${ClassMetadataMap.name}`, () => {
  class GraphClass {}

  test('get unregistered', () => {
    const p = new ClassMetadataMap();
    expect(p.get(GraphClass)).toBe(null);
  });

  test('register and get', () => {
    const p = new ClassMetadataMap();
    p.register(GraphClass, 'test');
    expect(p.get(GraphClass)).toBe('test');
  });
});
