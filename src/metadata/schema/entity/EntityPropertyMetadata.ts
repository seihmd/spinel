import { Alias } from './Alias';
import { PropertyType } from './PropertyType';
import { Neo4jPropertyType } from './Neo4jPropertyType';

export class EntityPropertyMetadata {
  private readonly propertyType: PropertyType;
  private readonly alias: Alias | null;
  private readonly type: Neo4jPropertyType | null;

  constructor(
    propertyType: PropertyType,
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

  getType(): unknown {
    return this.propertyType.getType();
  }

  getNeo4jPropertyType(): Neo4jPropertyType | null {
    return this.type;
  }
}
