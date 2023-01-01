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
      return m?.getKey() === key;
    });
  }
}
