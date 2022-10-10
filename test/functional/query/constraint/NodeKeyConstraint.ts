import { NodeLabel } from '../../../../src/domain/node/NodeLabel';
import { ConstraintInterface } from './ConstraintInterface';

export class NodeKeyConstraint implements ConstraintInterface {
  private readonly label: NodeLabel;
  private readonly properties: string[];

  constructor(label: NodeLabel, properties: string[]) {
    this.label = label;
    this.properties = properties;
  }

  getName(): string {
    const keys = this.properties.sort().join('-');

    return `SPNL-nk-${this.label.toString()}-${keys}`;
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
