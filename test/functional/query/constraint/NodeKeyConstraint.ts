import { NodeLabel } from '../../../../src/domain/node/NodeLabel';
import { ConstraintData } from './ConstraintData';

export class NodeKeyConstraint {
  static withData(data: ConstraintData): NodeKeyConstraint {
    if (data.type !== 'NODE_KEY' || data.entityType !== 'NODE') {
      throw new Error();
    }

    return new NodeKeyConstraint(
      data.name,
      new NodeLabel(data.labelsOrTypes[0]),
      data.properties
    );
  }

  private readonly name: string;
  private readonly label: NodeLabel;
  private readonly properties: string[];

  constructor(name: string, label: NodeLabel, properties: string[]) {
    this.name = name;
    this.label = label;
    this.properties = properties;
  }

  getName(): string {
    return this.name;
  }

  getLabel(): NodeLabel {
    return this.label;
  }

  getProperties(): string[] {
    return this.properties;
  }
}
