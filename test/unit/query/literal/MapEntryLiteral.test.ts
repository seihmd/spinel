import { MapEntryLiteral } from 'query/literal/MapEntryLiteral';

describe(`${MapEntryLiteral.name}`, () => {
  test('get', () => {
    expect(new MapEntryLiteral(['key', 'value']).get()).toBe('key:value');
  });
});
