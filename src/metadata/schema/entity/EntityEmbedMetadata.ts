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
    const m = [
      this.embeddableMetadata.getPrimary(),
      ...this.embeddableMetadata.getProperties(),
    ].find((m) => {
      return m?.getNeo4jKey() === neo4jKey;
    });

    if (!m) {
      throw new Error();
    }

    return m.getKey();
  }

  toNeo4jKey(appKey: string) {
    const m = [
      this.embeddableMetadata.getPrimary(),
      ...this.embeddableMetadata.getProperties(),
    ].find((m) => {
      return m?.getKey() === appKey;
    });

    if (!m) {
      throw new Error();
    }

    return m.getNeo4jKey();
  }
}
