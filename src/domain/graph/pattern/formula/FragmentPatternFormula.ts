import { isDirectionTerm, Term } from '../term/Term';
import { LEFT, NONE, RIGHT } from '../../Direction';
import { PatternFormula } from './PatternFormula';

export class FragmentPatternFormula extends PatternFormula {
  protected getParseStartIndex(): 0 | 1 {
    return 1;
  }

  protected reverse(): FragmentPatternFormula {
    return new FragmentPatternFormula(this.reverseFormula());
  }

  protected assert(terms: Term[]): void {
    super.assert(terms);

    if (!isDirectionTerm(terms[0])) {
      throw new Error(
        `FragmentFormula must start with "${LEFT}" | "${RIGHT}" | "${NONE}"`
      );
    }
  }
}
