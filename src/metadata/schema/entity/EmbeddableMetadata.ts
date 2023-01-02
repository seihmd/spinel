import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';
import { Properties } from './Properties';

export class EmbeddableMetadata {
  constructor(
    private readonly cstr: AnyClassConstructor,
    private readonly properties: Properties
  ) {}

  getCstr(): AnyClassConstructor {
    return this.cstr;
  }

  getPrimary(): EntityPrimaryMetadata | null {
    return this.properties.getPrimary();
  }

  getProperties(): EntityPropertyMetadata[] {
    return this.properties.getProperties();
  }

  withPrefix(prefix: string) {
    return new EmbeddableMetadata(
      this.cstr,
      this.properties.withPrefix(prefix)
    );
  }
}
