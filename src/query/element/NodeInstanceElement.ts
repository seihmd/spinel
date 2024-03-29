import { AssociationReferenceTerm } from '../../domain/graph/pattern/term/AssociationReferenceTerm';
import { NodeKeyTerm } from '../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabel } from '../../domain/node/NodeLabel';
import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { NodeEntityMetadata } from '../../metadata/schema/entity/NodeEntityMetadata';
import { GraphNodeMetadata } from '../../metadata/schema/graph/GraphNodeMetadata';
import { BranchIndexesLiteral } from '../literal/BranchIndexesLiteral';
import { BranchIndexes } from '../meterial/BranchIndexes';
import { ElementContext } from './ElementContext';
import { EntityElementInterface } from './EntityElementInterface';
import { InstanceElement } from './InstanceElement';

export class NodeInstanceElement
  extends InstanceElement<NodeEntityMetadata | GraphNodeMetadata>
  implements EntityElementInterface
{
  private readonly context: ElementContext;
  private readonly term: NodeKeyTerm | AssociationReferenceTerm;

  constructor(
    instance: InstanceType<ClassConstructor<object>>,
    metadata: NodeEntityMetadata | GraphNodeMetadata,
    context: ElementContext,
    term: NodeKeyTerm | AssociationReferenceTerm
  ) {
    super(instance, metadata);
    this.context = context;
    this.term = term;
  }

  getVariableName(): string {
    return `${this.getVariablePrefix()}n${this.context.getIndex()}`;
  }

  private getVariablePrefix(): string {
    return new BranchIndexesLiteral(this.context.getBranchIndexes()).get();
  }

  getLabel(): NodeLabel {
    return this.metadata.getLabel();
  }

  getGraphKey(): string {
    return this.term.getKey() ?? '';
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

  withContext(newContext: ElementContext): NodeInstanceElement {
    return new NodeInstanceElement(
      this.instance,
      this.metadata,
      newContext,
      this.term
    );
  }
}
