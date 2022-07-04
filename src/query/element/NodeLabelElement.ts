import { NodeLabel } from '../../domain/node/NodeLabel';
import { NodeLabelTerm } from '../../domain/graph/pattern/formula/NodeLabelTerm';

export class NodeLabelElement {
  private term: NodeLabelTerm;

  constructor(term: NodeLabelTerm) {
    this.term = term;
  }

  getGraphParameterKey(): string | null {
    const parameterModifier = this.term.getParameterModifier();
    if (parameterModifier !== null) {
      return parameterModifier;
    }
    return null;
  }

  getGraphKey(): string {
    return '';
  }

  getLabel(): NodeLabel {
    return new NodeLabel(this.term.getValueWithoutModifier());
  }

  isArray(): boolean {
    return false;
  }
}
