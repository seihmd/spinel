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
    return [...this.map.values()].reduce(
      (list: EntityPropertyMetadata[], propertyMetadata) => {
        if (propertyMetadata instanceof EntityPropertyMetadata) {
          return [...list, propertyMetadata];
        }

        if (propertyMetadata instanceof EntityEmbedMetadata) {
          return [...list, ...propertyMetadata.getProperties()];
        }

        return list;
      },
      []
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

  withPrefix(prefix: string): Properties {
    const prefixed = new Properties();
    Array.from(this.map.values()).map((metadata) => {
      if (metadata instanceof EntityEmbedMetadata) {
        throw new Error();
      }
      prefixed.set(metadata.withPrefix(prefix));
    });

    return prefixed;
  }
}
