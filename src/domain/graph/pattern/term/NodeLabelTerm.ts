import { LabelPrefix, PatternTerm } from './PatternTerm';
import { NodeLabel } from '../../../node/NodeLabel';

export class NodeLabelTerm extends PatternTerm {
  static withNodeLabel(nodeLabel: NodeLabel): NodeLabelTerm {
    return new NodeLabelTerm(`:${nodeLabel.toString()}`);
  }

  constructor(value: string) {
    super(value);

    this.assert();
  }

  getValueWithoutLabelPrefix(): string {
    return this.value.replace(LabelPrefix, '');
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
