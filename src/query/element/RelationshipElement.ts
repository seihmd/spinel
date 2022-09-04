import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { GraphRelationshipMetadata } from '../../metadata/schema/graph/GraphRelationshipMetadata';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { RelationshipEntityMetadata } from '../../metadata/schema/entity/RelationshipEntityMetadata';
import { RelationshipKeyTerm } from '../../domain/graph/pattern/term/RelationshipKeyTerm';
import { BranchIndexesLiteral } from '../literal/BranchIndexesLiteral';
import { ElementContext } from './ElementContext';
import { EntityElementInterface } from './EntityElementInterface';
import { BranchIndexes } from '../meterial/BranchIndexes';
import { EntityPrimaryMetadata } from '../../metadata/schema/entity/EntityPrimaryMetadata';

export class RelationshipElement implements EntityElementInterface {
  private readonly term: RelationshipKeyTerm;
  private readonly graphRelationshipMetadata:
    | GraphRelationshipMetadata
    | RelationshipEntityMetadata;
  private readonly context: ElementContext;

  constructor(
    term: RelationshipKeyTerm,
    graphRelationshipMetadata:
      | GraphRelationshipMetadata
      | RelationshipEntityMetadata,
    context: ElementContext
  ) {
    this.term = term;
    this.graphRelationshipMetadata = graphRelationshipMetadata;
    this.context = context;
  }

  getType(): RelationshipType {
    return this.graphRelationshipMetadata.getType();
  }

  getCstr(): AnyClassConstructor {
    return this.graphRelationshipMetadata.getCstr();
  }

  getVariableName(): string {
    return `${this.getVariablePrefix()}r${this.context.getIndex()}`;
  }

  private getVariablePrefix(): string {
    return new BranchIndexesLiteral(this.context.getBranchIndexes()).get();
  }

  getGraphKey(): string {
    return this.term.getValue();
  }

  getGraphParameterKey(): string {
    return this.term.getValue();
  }

  getWhereVariableName(): string {
    return `${this.context.isOnBranch() ? '*.' : ''}${this.term.getValue()}`;
  }

  getIndex(): number {
    return this.context.getIndex();
  }

  withContext(newContext: ElementContext): RelationshipElement {
    return new RelationshipElement(
      this.term,
      this.graphRelationshipMetadata,
      newContext
    );
  }

  equalsBranchIndexes(branchIndexes: BranchIndexes): boolean {
    return this.context.equalsBranchIndexes(branchIndexes);
  }

  getPrimaries(): EntityPrimaryMetadata[] {
    if (this.graphRelationshipMetadata instanceof GraphRelationshipMetadata) {
      return [this.graphRelationshipMetadata.getEntityMetadata().getPrimary()];
    }

    return [this.graphRelationshipMetadata.getPrimary()];
  }
}
