import { BRANCH_END } from '../../domain/graph/pattern/term/PatternTerm';
import { RelationshipTypeTerm } from '../../domain/graph/pattern/term/RelationshipTypeTerm';
import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { BranchIndexesLiteral } from '../literal/BranchIndexesLiteral';
import { BranchIndexes } from '../meterial/BranchIndexes';
import { ElementContext } from './ElementContext';
import { EntityElementInterface } from './EntityElementInterface';

export class RelationshipTypeElement implements EntityElementInterface {
  private readonly term: RelationshipTypeTerm;
  private readonly context: ElementContext;

  constructor(term: RelationshipTypeTerm, context: ElementContext) {
    this.term = term;
    this.context = context;
  }

  getType(): RelationshipType {
    return new RelationshipType(this.term.getValueWithoutModifier());
  }

  getVariableName(): string {
    return `${this.getVariablePrefix()}r${this.context.getIndex()}`;
  }

  private getVariablePrefix(): string {
    return new BranchIndexesLiteral(this.context.getBranchIndexes()).get();
  }

  getGraphKey(): string {
    return '';
  }

  getGraphParameterKey(): string | null {
    const parameterModifier = this.term.getParameterModifier();
    if (parameterModifier !== null) {
      return parameterModifier;
    }
    return null;
  }

  getWhereVariableName(): string | null {
    const graphParameterKey = this.getGraphParameterKey();
    if (graphParameterKey === null) {
      return null;
    }
    return `${
      this.context.isOnBranch() ? `${BRANCH_END}.` : ''
    }${graphParameterKey}`;
  }

  withContext(newContext: ElementContext): EntityElementInterface {
    return new RelationshipTypeElement(this.term, newContext);
  }

  getIndex(): number {
    return this.context.getIndex();
  }

  equalsBranchIndexes(branchIndexes: BranchIndexes): boolean {
    return this.context.equalsBranchIndexes(branchIndexes);
  }
}
