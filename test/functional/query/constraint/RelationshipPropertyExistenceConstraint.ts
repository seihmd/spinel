import { RelationshipType } from '../../../../src/domain/relationship/RelationshipType';

export class RelationshipPropertyExistenceConstraint {
  private readonly type: RelationshipType;
  private readonly property: string;

  constructor(type: RelationshipType, property: string) {
    this.type = type;
    this.property = property;
  }

  getName(): string {
    return `SPNL-rpe-${this.type.toString()}-${this.property}`;
  }
}
