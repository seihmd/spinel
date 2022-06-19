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

  validate(): void {
    this.getPrimary();
  }

  getPrimary(): EntityPrimaryMetadata {
    for (const propertyMetadata of this.map.values()) {
      if (propertyMetadata instanceof EntityPrimaryMetadata) {
        return propertyMetadata;
      }
    }
    throw new Error('Entity must have one Primary property');
  }

  getProperties(): EntityPropertyMetadata[] {
    return [...this.map.values()].filter(
      (propertyMetadata): propertyMetadata is EntityPropertyMetadata =>
        propertyMetadata instanceof EntityPropertyMetadata
    );
  }
}
