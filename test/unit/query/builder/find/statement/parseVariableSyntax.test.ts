import { parseVariableSyntax } from '../../../../../../src/query/builder/find/statement/parseVariableSyntax';

describe('parseVariableSyntax', () => {
  const testCases: [string, [string, string | null][] | null][] = [
    [
      '.shop.property',
      [
        ['@.shop.property', null],
        ['@.shop', 'property'],
        ['@', 'shop.property'],
      ],
    ],
    [
      '.shopItems.item.property',
      [
        ['@.shopItems.item', 'property'],
        ['@.shopItems', 'item.property'],
      ],
    ],
    [
      '.shopItems.item.embed.property',
      [
        ['@.shopItems.item.embed', 'property'],
        ['@.shopItems.item', 'embed.property'],
      ],
    ],
    [
      '.shop',
      [
        ['@.shop', null],
        ['@', 'shop'],
      ],
    ],
    [
      'shop.property',
      [
        ['shop.property', null],
        ['shop', 'property'],
      ],
    ],
    ['shop.embed.property', [['shop', 'embed.property']]],
    ['shop', [['shop', null]]],
    ['a.b.c.d.e', null],
  ];

  test.each(testCases)(
    'parse',
    (syntax: string, expected: [string, string | null][] | null) => {
      expect(parseVariableSyntax(syntax)).toStrictEqual(expected);
    }
  );
});
