import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';

export class Properties {
  private map: Map<string, EntityPrimaryMetadata | EntityPropertyMetadata> =
    new Map();

  set(property: EntityPrimaryMetadata | EntityPropertyMetadata): void {
    if (this.map.has(property.getKey())) {
      throw new Error(`Property key "${property.getKey()}" already set`);
    }

    this.map.set(property.getKey(), property);
  }

  getPrimary(): EntityPrimaryMetadata | null {
    for (const propertyMetadata of this.map.values()) {
      if (propertyMetadata instanceof EntityPrimaryMetadata) {
        return propertyMetadata;
      }
    }
    return null;
  }

  getProperties(): EntityPropertyMetadata[] {
    return [...this.map.values()].filter(
      (propertyMetadata): propertyMetadata is EntityPropertyMetadata =>
        propertyMetadata instanceof EntityPropertyMetadata
    );
  }

  toNeo4jKey(propertyKey: string): string {
    for (const metadata of this.map.values()) {
      if (metadata.getKey() === propertyKey) {
        return metadata.getNeo4jKey();
      }
    }
    throw new Error(`Property key "${propertyKey}" not found`);
  }
}
