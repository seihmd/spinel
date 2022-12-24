import { NodeLabel } from '../../../node/NodeLabel';
import { EntityTerm } from './EntityTerm';
import { LABEL_PREFIX } from './modifiers';

export class NodeLabelTerm extends EntityTerm {
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
