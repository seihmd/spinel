import { NodeLabel } from '../../../node/NodeLabel';
import { LABEL_PREFIX } from './modifiers';
import { PatternTerm } from './PatternTerm';

export class NodeLabelTerm extends PatternTerm {
  static withNodeLabel(nodeLabel: NodeLabel): NodeLabelTerm {
    return new NodeLabelTerm(`:${nodeLabel.toString()}`);
  }

  constructor(value: string) {
    super(value);

    this.assert();
  }

  getValueWithoutLabelPrefix(): string {
    return this.value.replace(LABEL_PREFIX, '');
  }

  getLabel(): string | null {
    return this.getValueWithoutModifier();
  }

  getKey(): string | null {
    return this.getParameterModifier();
  }

  private assert(): void {
    if (this.isDirection() || this.isBranchEnd() || !this.hasLabelModifier()) {
      this.throwInvalidValueError();
    }
  }
}
