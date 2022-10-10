import { EntityPropertyMetadata } from '../entity/EntityPropertyMetadata';
import { EntityPrimaryMetadata } from '../entity/EntityPrimaryMetadata';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';

export class RelationshipPropertyExistenceConstraintMetadata {
  private readonly type: RelationshipType;
  private readonly propertyMetadata:
    | EntityPropertyMetadata
    | EntityPrimaryMetadata;

  constructor(
    type: RelationshipType,
    propertyMetadata: EntityPropertyMetadata | EntityPrimaryMetadata
  ) {
    this.type = type;
    this.propertyMetadata = propertyMetadata;
  }

  getName(): string {
    return `SPNL-rpe-${this.type.toString()}-${this.propertyMetadata.getNeo4jKey()}`;
  }
}
