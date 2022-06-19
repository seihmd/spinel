import { Alias } from './Alias';
import { PropertyType } from './PropertyType';

export class EntityPropertyMetadata {
  private readonly propertyType: PropertyType;
  private readonly alias: Alias | null;

  constructor(propertyType: PropertyType, alias: Alias | null) {
    this.propertyType = propertyType;
    this.alias = alias;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getType(): unknown {
    return this.propertyType.getType();
  }
}
