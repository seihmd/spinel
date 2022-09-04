import { InstanceElement } from './InstanceElement';
import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { RelationshipEntityMetadata } from '../../metadata/schema/entity/RelationshipEntityMetadata';
import { EntityElementInterface } from './EntityElementInterface';
import { ElementContext } from './ElementContext';
import { BranchIndexesLiteral } from '../literal/BranchIndexesLiteral';
import { BranchIndexes } from '../meterial/BranchIndexes';
import { RelationshipKeyTerm } from '../../domain/graph/pattern/term/RelationshipKeyTerm';

export class RelationshipInstanceElement
  extends InstanceElement<RelationshipEntityMetadata>
  implements EntityElementInterface
{
  private readonly context: ElementContext;
  private readonly term: RelationshipKeyTerm;

  constructor(
    instance: InstanceType<ClassConstructor<object>>,
    metadata: RelationshipEntityMetadata,
    context: ElementContext,
    term: RelationshipKeyTerm
  ) {
    super(instance, metadata);
    this.term = term;
    this.context = context;
  }

  getType(): RelationshipType {
    return this.metadata.getType();
  }

  getGraphKey(): string {
    return this.term.getKey();
  }

  getVariableName(): string {
    return `${this.getVariablePrefix()}r${this.context.getIndex()}`;
  }

  private getVariablePrefix(): string {
    return new BranchIndexesLiteral(this.context.getBranchIndexes()).get();
  }

  equalsBranchIndexes(branchIndexes: BranchIndexes): boolean {
    return this.context.equalsBranchIndexes(branchIndexes);
  }

  getGraphParameterKey(): string | null {
    return null;
  }

  getIndex(): number {
    return this.context.getIndex();
  }

  getWhereVariableName(): string | null {
    return null;
  }

  withContext(newContext: ElementContext): RelationshipInstanceElement {
    return new RelationshipInstanceElement(
      this.instance,
      this.metadata,
      newContext,
      this.term
    );
  }
}
