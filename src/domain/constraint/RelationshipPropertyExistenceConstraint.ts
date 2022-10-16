import { ConstraintInterface } from './ConstraintInterface';
import { RelationshipType } from '../relationship/RelationshipType';

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
    return `SPNL_c_rpe_${this.type.toString()}_${this.property}`;
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
