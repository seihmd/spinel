import { AnyClassConstructor } from '../../domain/type/ClassConstructor';

export class ClassMetadataMap<T> {
  private map: Map<AnyClassConstructor, T> = new Map();

  register(cstr: AnyClassConstructor, metadata: T): void {
    if (this.map.has(cstr)) {
      throw new Error(`Metadata of ${cstr.name} is already registered`);
    }
    this.map.set(cstr, metadata);
  }

  get(cstr: AnyClassConstructor): T | null {
    return this.map.get(cstr) ?? null;
  }
}
