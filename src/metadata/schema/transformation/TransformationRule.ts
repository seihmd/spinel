import { EntityPrimaryMetadata } from '../entity/EntityPrimaryMetadata';
import { EntityPropertyMetadata } from '../entity/EntityPropertyMetadata';
import { TransformerInterface } from './transformer/TransformerInterface';

export class TransformationRule {
  static new(propertyMetadata: EntityPropertyMetadata | EntityPrimaryMetadata) {
    return new TransformationRule(
      propertyMetadata.getAlias() ?? propertyMetadata.getKey(),
      propertyMetadata.getTransformer()
    );
  }

  private readonly key: string;
  private readonly transformer: TransformerInterface;

  constructor(key: string, transformer: TransformerInterface) {
    this.key = key;
    this.transformer = transformer;
  }

  getKey(): string {
    return this.key;
  }

  restore(value: unknown): any {
    return this.transformer.restore(value);
  }

  preserve(value: unknown): any {
    return this.transformer.preserve(value);
  }
}
