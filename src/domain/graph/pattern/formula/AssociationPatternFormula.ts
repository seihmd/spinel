import { AssociationReferenceTerm } from '../term/AssociationReferenceTerm';
import { NodeKeyTerm } from '../term/NodeKeyTerm';
import { RelationshipKeyTerm } from '../term/RelationshipKeyTerm';
import { isEntityKeyTerm, Term } from '../term/Term';
import { parseAssociationFormula } from './parseAssociationFormula';
import { PatternFormula } from './PatternFormula';

export type IntermediateTerm = Exclude<
  Term,
  NodeKeyTerm | RelationshipKeyTerm | AssociationReferenceTerm
>;

export class AssociationPatternFormula extends PatternFormula {
  getIntermediate(): IntermediateTerm[] {
    return this.terms
      .slice(1)
      .filter(
        (term): term is IntermediateTerm =>
          !(term instanceof AssociationReferenceTerm)
      );
  }

  protected parse(formula: string): Term[] {
    return parseAssociationFormula(formula, 0);
  }

  protected getParseStartIndex(): 0 | 1 {
    return 0;
  }

  protected reverse(): AssociationPatternFormula {
    return new AssociationPatternFormula(this.reverseFormula());
  }

  protected assert(terms: Term[]): void {
    super.assert(terms);

    terms.slice(1).forEach((term, index) => {
      if (isEntityKeyTerm(term)) {
        throw new Error(
          `${AssociationPatternFormula.name} must have no key except at the root`
        );
      }

      if (
        index !== terms.length - 2 &&
        term instanceof AssociationReferenceTerm
      ) {
        throw new Error(
          `${AssociationPatternFormula.name} must have no reference term except at the terminal`
        );
      }
    });
  }
}
