import { AnyClassConstructor } from '../../domain/type/ClassConstructor';

export class PropertyMetadataMap<T> {
  private map: Map<AnyClassConstructor, T> = new Map();

  update(cstr: AnyClassConstructor, update: (value: T | undefined) => T): void {
    this.map.set(cstr, update(this.map.get(cstr)));
  }

  get(cstr: AnyClassConstructor): T | null {
    const value = this.map.get(cstr) ?? null;
    this.map.delete(cstr);
    return value;
  }
}
