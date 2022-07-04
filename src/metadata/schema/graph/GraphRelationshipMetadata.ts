import { GraphRelationshipPropertyType } from './GraphRelationshipPropertyType';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { RelationshipEntityMetadata } from '../entity/RelationshipEntityMetadata';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';

export class GraphRelationshipMetadata {
  private readonly propertyType: GraphRelationshipPropertyType;
  private readonly entityMetadata: RelationshipEntityMetadata;

  constructor(
    propertyType: GraphRelationshipPropertyType,
    entityMetadata: RelationshipEntityMetadata
  ) {
    this.propertyType = propertyType;
    this.entityMetadata = entityMetadata;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getCstr(): AnyClassConstructor {
    return this.propertyType.getType();
  }

  getEntityMetadata(): RelationshipEntityMetadata {
    return this.entityMetadata;
  }

  getType(): RelationshipType {
    return this.entityMetadata.getType();
  }
}
