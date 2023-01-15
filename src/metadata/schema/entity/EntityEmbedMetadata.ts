import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { isConstructor } from '../../../util/isConstructor';
import { EmbeddableMetadata } from './EmbeddableMetadata';
import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';
import { PropertyType } from './PropertyType';

export class EntityEmbedMetadata {
  constructor(
    private readonly propertyType: PropertyType,
    private readonly embeddableMetadata: EmbeddableMetadata
  ) {
    if (!isConstructor(this.propertyType.getType())) {
      throw new Error();
    }
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getType(): AnyClassConstructor {
    return this.propertyType.getType() as AnyClassConstructor;
  }

  getPrimary(): EntityPrimaryMetadata | null {
    return this.embeddableMetadata.getPrimary();
  }

  getProperties(): EntityPropertyMetadata[] {
    return this.embeddableMetadata.getProperties();
  }

  hasNeo4jKey(key: string) {
    return [
      this.embeddableMetadata.getPrimary(),
      ...this.embeddableMetadata.getProperties(),
    ].some((m) => {
      return m?.getNeo4jKey() === key;
    });
  }

  toKey(neo4jKey: string) {
    const propertyMetadata = [
      this.embeddableMetadata.getPrimary(),
      ...this.embeddableMetadata.getProperties(),
    ].find((m) => {
      return m?.getNeo4jKey() === neo4jKey;
    });

    if (!propertyMetadata) {
      throw new Error();
    }

    const alias = propertyMetadata.getAlias();
    if (alias !== null) {
      return alias;
    }

    return propertyMetadata.getKey();
  }

  toNeo4jKey(appKey: string) {
    const propertyMetadata = [
      this.embeddableMetadata.getPrimary(),
      ...this.embeddableMetadata.getProperties(),
    ].find((m) => {
      if (m?.getKey() === appKey) {
        return true;
      }
      return m?.getAlias() === appKey;
    });

    if (!propertyMetadata) {
      throw new Error(appKey);
    }

    return propertyMetadata.getNeo4jKey();
  }
}
