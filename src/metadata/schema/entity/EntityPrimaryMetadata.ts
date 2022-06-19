import { Alias } from './Alias';
import { PrimaryType } from './PrimaryType';

export class EntityPrimaryMetadata {
  propertyType: PrimaryType;
  alias: Alias | null;

  constructor(propertyType: PrimaryType, alias: Alias | null) {
    this.propertyType = propertyType;
    this.alias = alias;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getType(): typeof String | typeof Number {
    return this.propertyType.getType();
  }
}
