import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';

export class PropertiesDuplicateError extends Error {
  constructor(cstr: AnyClassConstructor, name: string) {
    super(`Class "${cstr.name}" has duplicate property name "${name}".`);
  }
}
