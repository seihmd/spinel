import { PatternFormula } from './PatternFormula';
import { Term } from '../term/Term';
import { NodeKeyTerm } from '../term/NodeKeyTerm';
import { RelationshipKeyTerm } from '../term/RelationshipKeyTerm';
import { BranchEndTerm } from '../term/BranchEndTerm';

export class GraphPatternFormula extends PatternFormula {
  constructor(formula: string) {
    super(formula);
  }

  get(): Exclude<Term, BranchEndTerm>[] {
    return super.get() as Exclude<Term, BranchEndTerm>[];
  }

  protected getParseStartIndex(): 0 | 1 {
    return 0;
  }

  protected reverse(): PatternFormula {
    return new GraphPatternFormula(this.reverseFormula());
  }

  protected assert(terms: Term[]) {
    const keys = terms
      .filter(
        (term): boolean =>
          term instanceof NodeKeyTerm || term instanceof RelationshipKeyTerm
      )
      .map((term) => term.getValue());

    if (new Set(keys).size !== keys.length) {
      throw new Error(`Pattern has duplicate keys.`);
    }
    if (terms.find((term) => term instanceof BranchEndTerm)) {
      throw new Error(`${GraphPatternFormula.name} cannot have `);
    }
  }
}
