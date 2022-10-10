import { NodeLabel } from '../../../../src/domain/node/NodeLabel';
import { ConstraintData } from './ConstraintData';

export class NodePropertyExistenceConstraint {
  static withData(object: ConstraintData): NodePropertyExistenceConstraint {
    if (
      object.type !== 'NODE_PROPERTY_EXISTENCE' ||
      object.entityType !== 'NODE'
    ) {
      throw new Error();
    }

    return new NodePropertyExistenceConstraint(
      object.name,
      new NodeLabel(object.labelsOrTypes[0]),
      object.properties[0]
    );
  }

  private readonly name: string;
  private readonly label: NodeLabel;
  private readonly property: string;

  constructor(name: string, label: NodeLabel, property: string) {
    this.name = name;
    this.label = label;
    this.property = property;
  }

  getName(): string {
    return this.name;
  }

  getLabel(): NodeLabel {
    return this.label;
  }

  getProperty(): string {
    return this.property;
  }
}
