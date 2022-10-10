import { NodeLabel } from '../../../../src/domain/node/NodeLabel';
import { ConstraintInterface } from './ConstraintInterface';

export class UniquenessConstraint implements ConstraintInterface {
  private readonly label: NodeLabel;
  private readonly property: string;

  constructor(label: NodeLabel, property: string) {
    this.label = label;
    this.property = property;
  }

  getName(): string {
    return `SPNL-u-${this.label.toString()}-${this.property}`;
  }

  getLabelOrType(): NodeLabel {
    return this.label;
  }

  getProperties(): string[] {
    return [this.property];
  }

  getRequire(): string {
    return 'UNIQUE';
  }
}
