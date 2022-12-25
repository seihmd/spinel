import { VariableMap } from './VariableMap';

export function assignVariables(
  statement: string,
  variableMap: VariableMap
): string {
  const splits = statement.split(/("[^"]*")|('[^']*')/);
  // console.log(splits);

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
            value.startsWith('$')
          ) {
            return value;
          }

          const next = findNext(index);
          if (
            next === null ||
            next === '[' ||
            next === ']' ||
            next === ')' ||
            isTerm(next ?? '')
          ) {
            const keys = variableMap.sortedKeys();
            for (const variable of keys) {
              if (value.startsWith(variable)) {
                const to = variableMap.get(variable);
                if (to !== null) {
                  return value.replace(variable, to);
                } else {
                  throw new Error(variable);
                }
              }
            }
          }

          return value;
        })
        .join('');
    })
    .join('');
}
