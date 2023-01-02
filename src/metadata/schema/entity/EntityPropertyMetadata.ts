import { NothingTransformer } from '../transformation/transformer/NothingTransformer';
import { TransformerInterface } from '../transformation/transformer/TransformerInterface';
import { Alias } from './Alias';
import { PropertyType } from './PropertyType';

export class EntityPropertyMetadata {
  private prefix = '';

  constructor(
    private readonly propertyType: PropertyType,
    private readonly alias: Alias | null,
    private readonly transformer: TransformerInterface | null,
    private readonly notNull: boolean
  ) {}

  withPrefix(prefix: string): EntityPropertyMetadata {
    const prefixed = new EntityPropertyMetadata(
      this.propertyType,
      this.alias,
      this.transformer,
      this.notNull
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

    return this.prefix + this.getKey();
  }

  getType(): unknown {
    return this.propertyType.getType();
  }

  getTransformer(): TransformerInterface {
    return this.transformer || new NothingTransformer();
  }

  isNotNull(): boolean {
    return this.notNull;
  }
}
