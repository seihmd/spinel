import { NodeLabel } from '../../../../src/domain/node/NodeLabel';

export class NodeKeyConstraint {
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
}
