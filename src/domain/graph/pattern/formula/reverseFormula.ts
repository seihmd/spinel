import { parseFormula } from './parseFormula';
import { normalizeFormula } from './normalizeFormula';
import { reverseTerms } from '../term/reverseTerms';
import { termsToString } from '../term/termsToString';

export function reverseFormula(formula: string, startIndex: 0 | 1): string {
  const terms = parseFormula(normalizeFormula(formula), startIndex);
  return termsToString(reverseTerms(terms));
}
