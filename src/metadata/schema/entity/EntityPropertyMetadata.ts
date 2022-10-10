import { Alias } from './Alias';
import { PropertyType } from './PropertyType';
import { TransformerInterface } from '../transformation/transformer/TransformerInterface';
import { NothingTransformer } from '../transformation/transformer/NothingTransformer';

export class EntityPropertyMetadata {
  private readonly propertyType: PropertyType;
  private readonly transformer: TransformerInterface | null;
  private readonly alias: Alias | null;

  constructor(
    propertyType: PropertyType,
    alias: Alias | null,
    transformer: TransformerInterface | null
  ) {
    this.propertyType = propertyType;
    this.alias = alias;
    this.transformer = transformer;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getNeo4jKey(): string {
    if (this.alias) {
      return this.alias.get();
    }

    return this.getKey();
  }

  getType(): unknown {
    return this.propertyType.getType();
  }

  getTransformer(): TransformerInterface {
    return this.transformer || new NothingTransformer();
  }
}
