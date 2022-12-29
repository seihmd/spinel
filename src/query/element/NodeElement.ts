import { NodeKeyTerm } from 'domain/graph/pattern/term/NodeKeyTerm';
import { AssociationReferenceTerm } from '../../domain/graph/pattern/term/AssociationReferenceTerm';
import { NodeLabel } from '../../domain/node/NodeLabel';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { EntityPrimaryMetadata } from '../../metadata/schema/entity/EntityPrimaryMetadata';
import { NodeEntityMetadata } from '../../metadata/schema/entity/NodeEntityMetadata';
import { GraphNodeMetadata } from '../../metadata/schema/graph/GraphNodeMetadata';
import { BranchIndexesLiteral } from '../literal/BranchIndexesLiteral';
import { BranchIndexes } from '../meterial/BranchIndexes';
import { ElementContext } from './ElementContext';
import { EntityElementInterface } from './EntityElementInterface';

export class NodeElement implements EntityElementInterface {
  private readonly term: NodeKeyTerm | AssociationReferenceTerm;
  private readonly graphNodeMetadata: GraphNodeMetadata | NodeEntityMetadata;
  private readonly context: ElementContext;

  constructor(
    term: NodeKeyTerm | AssociationReferenceTerm,
    graphNodeMetadata: GraphNodeMetadata | NodeEntityMetadata,
    context: ElementContext
  ) {
    this.term = term;
    this.graphNodeMetadata = graphNodeMetadata;
    this.context = context;
  }

  getLabel(): NodeLabel {
    return this.graphNodeMetadata.getLabel();
  }

  getCstr(): AnyClassConstructor {
    return this.graphNodeMetadata.getCstr();
  }

  getVariableName(): string {
    return `${this.getVariablePrefix()}n${this.context.getIndex()}`;
  }

  private getVariablePrefix(): string {
    return new BranchIndexesLiteral(this.context.getBranchIndexes()).get();
  }

  getGraphParameterKey(): string {
    return this.term.getValue();
  }

  getGraphKey(): string {
    return this.term.getValue();
  }

  getWhereVariableName(): string {
    return this.term.getValue();
  }

  getIndex(): number {
    return this.context.getIndex();
  }

  withContext(newContext: ElementContext): NodeElement {
    return new NodeElement(this.term, this.graphNodeMetadata, newContext);
  }

  equalsBranchIndexes(branchIndexes: BranchIndexes) {
    return this.context.equalsBranchIndexes(branchIndexes);
  }

  getPrimaries(): EntityPrimaryMetadata[] {
    if (this.graphNodeMetadata instanceof GraphNodeMetadata) {
      return [this.graphNodeMetadata.getEntityMetadata().getPrimary()];
    }

    return [this.graphNodeMetadata.getPrimary()];
  }
}
