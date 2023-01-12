const Dot = '.';
const GraphAlias = '@';

export function parseVariableSyntax(
  value: string
): [string, string | null][] | null {
  if (value.startsWith(Dot)) {
    value = GraphAlias + value;
  }

  const splitted = value.split(Dot);
  if (splitted.length === 1) {
    return [[value, null]];
  }

  if (splitted.length === 2) {
    if (value.startsWith(GraphAlias)) {
      return [[value, null]];
    } else {
      return [[splitted[0], splitted[1]]];
    }
  }

  if (splitted.length === 3) {
    if (value.startsWith(GraphAlias)) {
      return [
        [value, null],
        [`${splitted[0]}${Dot}${splitted[1]}`, `${splitted[2]}`],
        [splitted[0], `${splitted[1]}${Dot}${splitted[2]}`],
      ];
    } else {
      return [[`${splitted[0]}`, `${splitted[1]}${Dot}${splitted[2]}`]];
    }
  }

  if (splitted.length === 4) {
    return [
      [`${splitted[0]}${Dot}${splitted[1]}${Dot}${splitted[2]}`, splitted[3]],
      [
        `${splitted[0]}${Dot}${splitted[1]}`,
        `${splitted[2]}${Dot}${splitted[3]}`,
      ],
    ];
  }

  if (splitted.length === 5) {
    if (value.startsWith(GraphAlias)) {
      return [
        [
          `${splitted[0]}${Dot}${splitted[1]}${Dot}${splitted[2]}${Dot}${splitted[3]}`,
          splitted[4],
        ],
        [
          `${splitted[0]}${Dot}${splitted[1]}${Dot}${splitted[2]}`,
          `${splitted[3]}${Dot}${splitted[4]}`,
        ],
      ];
    }
  }

  return null;
}
