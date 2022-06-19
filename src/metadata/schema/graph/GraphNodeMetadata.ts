import { GraphNodePropertyType } from './GraphNodePropertyType';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';

export class GraphNodeMetadata {
  private readonly propertyType: GraphNodePropertyType;

  constructor(propertyType: GraphNodePropertyType) {
    this.propertyType = propertyType;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getType(): AnyClassConstructor {
    return this.propertyType.getType();
  }
}
