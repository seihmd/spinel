import { NodeLabelTerm } from '../../domain/graph/pattern/term/NodeLabelTerm';
import { NodeLabel } from '../../domain/node/NodeLabel';
import { BranchIndexesLiteral } from '../literal/BranchIndexesLiteral';
import { BranchIndexes } from '../meterial/BranchIndexes';
import { ElementContext } from './ElementContext';
import { EntityElementInterface } from './EntityElementInterface';

export class NodeLabelElement implements EntityElementInterface {
  private readonly term: NodeLabelTerm;
  private readonly context: ElementContext;

  constructor(term: NodeLabelTerm, context: ElementContext) {
    this.term = term;
    this.context = context;
  }

  getVariableName(): string {
    return `${this.getVariablePrefix()}n${this.context.getIndex()}`;
  }

  private getVariablePrefix(): string {
    return new BranchIndexesLiteral(this.context.getBranchIndexes()).get();
  }

  getGraphParameterKey(): string | null {
    return this.term.getAlias();
  }

  getGraphKey(): string {
    return '';
  }

  getWhereVariableName(): string | null {
    const graphParameterKey = this.getGraphParameterKey();
    if (graphParameterKey === null) {
      return null;
    }
    return graphParameterKey;
  }

  getLabel(): NodeLabel | null {
    const labelValue = this.term.getLabel();
    if (labelValue === null) {
      return null;
    }
    return new NodeLabel(labelValue);
  }

  isArray(): boolean {
    return false;
  }

  getIndex(): number {
    return this.context.getIndex();
  }

  equalsBranchIndexes(branchIndexes: BranchIndexes) {
    return this.context.equalsBranchIndexes(branchIndexes);
  }

  withContext(newContext: ElementContext): NodeLabelElement {
    return new NodeLabelElement(this.term, newContext);
  }
}
