import { ConstraintInterface } from './ConstraintInterface';
import { NodeLabel } from '../../domain/node/NodeLabel';

export class NodeKeyConstraint implements ConstraintInterface {
  private readonly label: NodeLabel;
  private readonly properties: string[];

  constructor(label: NodeLabel, properties: string[]) {
    this.label = label;
    this.properties = properties;
  }

  getName(): string {
    const keys = this.properties.sort().join('_');

    return `SPNL_nk_${this.label.toString()}_${keys}`;
  }

  getLabelOrType(): NodeLabel {
    return this.label;
  }

  getProperties(): string[] {
    return this.properties;
  }

  getRequire(): string {
    return 'NODE KEY';
  }
}
