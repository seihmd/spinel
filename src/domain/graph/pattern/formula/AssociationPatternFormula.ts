import { BranchEndTerm } from '../term/BranchEndTerm';
import { NodeKeyTerm } from '../term/NodeKeyTerm';
import { RelationshipKeyTerm } from '../term/RelationshipKeyTerm';
import { Term } from '../term/Term';
import { PatternFormula } from './PatternFormula';

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
}
