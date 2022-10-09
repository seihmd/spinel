import { Alias } from './Alias';
import { PrimaryType } from './PrimaryType';
import { TransformerInterface } from '../transformation/transformer/TransformerInterface';
import { NothingTransformer } from '../transformation/transformer/NothingTransformer';

export class EntityPrimaryMetadata {
  private readonly propertyType: PrimaryType;
  private readonly transformer: TransformerInterface | null;
  private readonly alias: Alias | null;

  constructor(
    propertyType: PrimaryType,
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

    return this.propertyType.getKey();
  }

  getType(): typeof String | typeof Number {
    return this.propertyType.getType();
  }

  getTransformer(): TransformerInterface {
    return this.transformer || new NothingTransformer();
  }
}
