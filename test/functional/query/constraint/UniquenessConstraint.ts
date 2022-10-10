import { NodeLabel } from '../../../../src/domain/node/NodeLabel';
import { ConstraintData } from './ConstraintData';

export class UniquenessConstraint {
  static withData(object: ConstraintData): UniquenessConstraint {
    if (object.type !== 'UNIQUENESS' || object.entityType !== 'NODE') {
      throw new Error();
    }

    return new UniquenessConstraint(
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
