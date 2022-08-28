import { MapLiteral } from '../../literal/MapLiteral';
import { MapEntryLiteral } from '../../literal/MapEntryLiteral';

describe(`${MapLiteral.name}`, () => {
  test.each([
    [[], '{}'],
    [[['key1', 'value1']], '{key1:value1}'],
    [
      [
        ['key1', 'value1'],
        ['key2', 'value2'],
      ],
      '{key1:value1,key2:value2}',
    ],
  ] as [[string, string][], string][])(
    'get',
    (entries: [string, string][], expected: string) => {
      const mapLiteral = new MapLiteral(MapEntryLiteral.new(entries));
      expect(mapLiteral.get()).toBe(expected);
    }
  );
});
