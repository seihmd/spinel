import { ConstraintInterface } from './ConstraintInterface';
import { NodeLabel } from '../node/NodeLabel';

export class NodePropertyExistenceConstraint implements ConstraintInterface {
  private readonly label: NodeLabel;
  private readonly property: string;

  constructor(label: NodeLabel, property: string) {
    this.label = label;
    this.property = property;
  }

  getName(): string {
    return `SPNL_c_npe_${this.label.toString()}_${this.property}`;
  }

  getLabelOrType(): NodeLabel {
    return this.label;
  }

  getProperties(): string[] {
    return [this.property];
  }

  getRequire(): string {
    return 'NOT NULL';
  }
}
