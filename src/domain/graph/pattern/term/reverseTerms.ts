import { Term } from './Term';
import { DirectionTerm } from './DirectionTerm';

export function reverseTerms(terms: Term[]): Term[] {
  return terms
    .slice()
    .reverse()
    .map((term) => {
      if (term instanceof DirectionTerm) {
        return term.reverse();
      }
      return term;
    });
}
