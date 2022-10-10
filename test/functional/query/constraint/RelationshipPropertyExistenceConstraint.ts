import { RelationshipType } from '../../../../src/domain/relationship/RelationshipType';
import { ConstraintInterface } from './ConstraintInterface';

export class RelationshipPropertyExistenceConstraint
  implements ConstraintInterface
{
  private readonly type: RelationshipType;
  private readonly property: string;

  constructor(type: RelationshipType, property: string) {
    this.type = type;
    this.property = property;
  }

  getName(): string {
    return `SPNL-rpe-${this.type.toString()}-${this.property}`;
  }

  getLabelOrType(): RelationshipType {
    return this.type;
  }

  getProperties(): string[] {
    return [this.property];
  }

  getRequire(): string {
    return 'NOT NULL';
  }
}
