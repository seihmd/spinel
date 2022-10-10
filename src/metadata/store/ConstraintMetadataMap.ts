import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { Constraints } from 'metadata/schema/constraint/Constraints';

export class ConstraintMetadataMap {
  private map: Map<AnyClassConstructor, Constraints> = new Map();

  update(
    cstr: AnyClassConstructor,
    update: (value: Constraints | undefined) => Constraints
  ): void {
    this.map.set(cstr, update(this.map.get(cstr)));
  }

  get(cstr: AnyClassConstructor): Constraints {
    const value = this.map.get(cstr) ?? new Constraints(cstr);
    this.map.delete(cstr);
    return value;
  }
}
