import { isReservedKeyword } from './isReservedKeyword';
import { VariableSyntaxTranslator } from './VariableSyntaxTranslator';

export function translateStatement(
  statement: string,
  variableSyntaxTranslator: VariableSyntaxTranslator
): string {
  const splits = statement.split(/("[^"]*")|('[^']*')/);
  return splits
    .filter((value) => value !== undefined && value !== '')
    .map((value) => {
      if (value.startsWith('"') || value.startsWith("'")) {
        return value;
      }

      const elms = value
        .split(/([ ()[\]=])/)
        .filter((value) => value !== undefined && value !== '');

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

      return elms
        .map((value, index) => {
          if (value === '.') {
            value = '@';
          }

          if (value.startsWith('.')) {
            value = '@' + value;
          }

          if (/^[^\w@]/.test(value) || isReservedKeyword(value)) {
            return value;
          }

          const next = findNext(index + 1);
          if (
            next === null ||
            next === '[' ||
            next === ']' ||
            next === ')' ||
            next === '=' ||
            /[\w:.]+/.test(next ?? '')
          ) {
            const variableSyntax = value.split(':')[0];
            const neo4jKey = variableSyntaxTranslator.translate(variableSyntax);
            if (neo4jKey !== null) {
              return neo4jKey;
            }

            return value;
          }

          return value;
        })
        .join('');
    })
    .join('');
}
