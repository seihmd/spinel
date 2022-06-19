import { GraphRelationshipPropertyType } from './GraphRelationshipPropertyType';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';

export class GraphRelationshipMetadata {
  private readonly propertyType: GraphRelationshipPropertyType;

  constructor(propertyType: GraphRelationshipPropertyType) {
    this.propertyType = propertyType;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getType(): AnyClassConstructor {
    return this.propertyType.getType();
  }
}
