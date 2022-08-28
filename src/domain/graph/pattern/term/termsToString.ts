import { Term } from './Term';

export function termsToString(terms: Term[]): string {
  return terms
    .map((term) => {
      return term.getValue();
    })
    .join('');
}
