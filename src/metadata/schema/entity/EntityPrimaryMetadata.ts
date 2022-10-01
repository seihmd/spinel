import { Alias } from './Alias';
import { PrimaryType } from './PrimaryType';
import { Neo4jPropertyType } from './Neo4jPropertyType';

export class EntityPrimaryMetadata {
  private readonly propertyType: PrimaryType;
  private readonly alias: Alias | null;
  private readonly type: Neo4jPropertyType | null;

  constructor(
    propertyType: PrimaryType,
    alias: Alias | null,
    type: Neo4jPropertyType | null
  ) {
    this.type = type;
    this.propertyType = propertyType;
    this.alias = alias;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getNeo4jKey(): string {
    if (this.alias) {
      return this.alias.get();
    }

    return this.propertyType.getKey();
  }

  getType(): typeof String | typeof Number {
    return this.propertyType.getType();
  }

  getNeo4jPropertyType(): Neo4jPropertyType | null {
    return this.type;
  }
}
