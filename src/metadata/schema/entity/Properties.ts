import { EntityEmbedMetadata } from './EntityEmbedMetadata';
import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';

type PropertyMetadata =
  | EntityPrimaryMetadata
  | EntityPropertyMetadata
  | EntityEmbedMetadata;

export class Properties {
  private map: Map<string, PropertyMetadata> = new Map();

  set(property: PropertyMetadata): void {
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
      if (
        propertyMetadata instanceof EntityEmbedMetadata &&
        propertyMetadata.getPrimary()
      ) {
        return propertyMetadata.getPrimary();
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

  getEmbeds(): EntityEmbedMetadata[] {
    return [...this.map.values()].filter(
      (propertyMetadata): propertyMetadata is EntityEmbedMetadata =>
        propertyMetadata instanceof EntityEmbedMetadata
    );
  }

  toNeo4jKey(propertyKey: string): string {
    const metadata = [this.getPrimary(), ...this.getProperties()].find(
      (metadata) => {
        if (metadata === null) {
          return false;
        }
        return metadata.getKey() === propertyKey;
      }
    );

    if (!metadata) {
      throw new Error(`Property key "${propertyKey}" not found`);
    }
    return metadata.getNeo4jKey();
  }
}
