import { NothingTransformer } from '../transformation/transformer/NothingTransformer';
import { TransformerInterface } from '../transformation/transformer/TransformerInterface';
import { Alias } from './Alias';
import { PrimaryType } from './PrimaryType';

export class EntityPrimaryMetadata {
  private prefix = '';

  constructor(
    private readonly propertyType: PrimaryType,
    private readonly alias: Alias | null,
    private readonly transformer: TransformerInterface | null
  ) {}

  withPrefix(prefix: string): EntityPrimaryMetadata {
    const prefixed = new EntityPrimaryMetadata(
      this.propertyType,
      this.alias,
      this.transformer
    );
    prefixed.prefix = prefix;

    return prefixed;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getNeo4jKey(): string {
    if (this.alias) {
      return this.prefix + this.alias.get();
    }

    return this.prefix + this.propertyType.getKey();
  }

  getType(): typeof String | typeof Number {
    return this.propertyType.getType();
  }

  getTransformer(): TransformerInterface {
    return this.transformer || new NothingTransformer();
  }

  isNotNull(): boolean {
    return true;
  }
}
