import { isEntityKeyTerm, Term } from '../term/Term';
import { PatternFormula } from './PatternFormula';
import { BranchEndTerm } from '../term/BranchEndTerm';
import { NodeKeyTerm } from '../term/NodeKeyTerm';
import { RelationshipKeyTerm } from '../term/RelationshipKeyTerm';

export type IntermediateTerm = Exclude<
  Term,
  NodeKeyTerm | RelationshipKeyTerm | BranchEndTerm
>;

export class AssociationPatternFormula extends PatternFormula {
  getIntermediate(): IntermediateTerm[] {
    return this.terms
      .slice(1)
      .filter(
        (term): term is IntermediateTerm => !(term instanceof BranchEndTerm)
      );
  }

  protected getParseStartIndex(): 0 | 1 {
    return 0;
  }

  protected reverse(): AssociationPatternFormula {
    return new AssociationPatternFormula(this.reverseFormula());
  }

  protected assert(terms: Term[]): void {
    super.assert(terms);

    terms.slice(1).forEach((term) => {
      if (isEntityKeyTerm(term)) {
        throw new Error(
          `${AssociationPatternFormula.name} must have no key except at the root`
        );
      }
    });

    if (
      terms.filter(
        (term, i) =>
          (i === 0 || i !== terms.length - 1) && term instanceof BranchEndTerm
      ).length > 0
    ) {
      throw new Error(
        `${AssociationPatternFormula.name} must have no branchEnd except at the terminal`
      );
    }
  }
}
