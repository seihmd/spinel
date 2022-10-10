import { NodeLabel } from '../../../../src/domain/node/NodeLabel';

export class UniquenessConstraint {
  private readonly label: NodeLabel;
  private readonly property: string;

  constructor(label: NodeLabel, property: string) {
    this.label = label;
    this.property = property;
  }

  getName(): string {
    return `SPNL-u-${this.label.toString()}-${this.property}`;
  }
}
