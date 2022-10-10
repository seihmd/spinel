import { RelationshipType } from '../../../../src/domain/relationship/RelationshipType';
import { ConstraintData } from './ConstraintData';

export class RelationshipPropertyExistenceConstraint {
  static withData(object: ConstraintData) {
    if (
      object.type !== 'RELATIONSHIP_PROPERTY_EXISTENCE' ||
      object.entityType !== 'RELATIONSHIP'
    ) {
      throw new Error();
    }

    return new RelationshipPropertyExistenceConstraint(
      object.name,
      new RelationshipType(object.labelsOrTypes[0]),
      object.properties[0]
    );
  }

  private readonly name: string;
  private readonly type: RelationshipType;
  private readonly property: string;

  constructor(name: string, type: RelationshipType, property: string) {
    this.name = name;
    this.type = type;
    this.property = property;
  }

  getName(): string {
    return this.name;
  }

  getType(): RelationshipType {
    return this.type;
  }

  getProperty(): string {
    return this.property;
  }
}
