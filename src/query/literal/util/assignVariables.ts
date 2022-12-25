import { isReservedKeyword } from './isReservedKeyword';
import { VariableMap } from './VariableMap';

export function assignVariables(
  statement: string,
  variableMap: VariableMap
): string {
  const splits = statement.split(/("[^"]*")|('[^']*')/);

  return splits
    .filter((value) => value !== undefined && value !== '')
    .map((value) => {
      if (value.startsWith('"') || value.startsWith("'")) {
        return value;
      }

      const elms = value
        .split(/([ ()[\]])/)
        .filter((value) => value !== undefined && value !== '');

      const len = elms.length;

      function findNext(index: number): string | null {
        while (index < elms.length - 1) {
          const value = elms[index];
          if (value !== ' ') {
            return value;
          }
          index++;
        }

        return null;
      }

      function isTerm(value: string): boolean {
        return /[\w:.]+/.test(value);
      }

      return elms
        .map((value, index) => {
          if (
            value === ' ' ||
            value === '(' ||
            value === ')' ||
            value === '[' ||
            value === ']' ||
            value === '-' ||
            value === '->' ||
            value === '<-' ||
            value.startsWith('$') ||
            value.startsWith(':') ||
            isReservedKeyword(value)
          ) {
            return value;
          }

          const next = findNext(index + 1);
          if (
            next === null ||
            next === '[' ||
            next === ']' ||
            next === ')' ||
            isTerm(next ?? '')
          ) {
            const keys = variableMap.sortedKeys().join('|');

            const sp = value.split(':')[0];
            const to = variableMap.get(sp);
            if (to !== null) {
              return value.replace(new RegExp(`^${sp}`), to);
            }
            const l = sp.lastIndexOf('.');
            if (l === -1) {
              return value;
            }
            const sp2 = sp.slice(0, l);
            const to2 = variableMap.get(sp2);
            if (to2 !== null) {
              return value.replace(new RegExp(`^${sp2}`), to2);
            }

            return value;
          }

          return value;
        })
        .join('');
    })
    .join('');
}