import { toInstance } from '../util/toInstance';
import { ClassConstructor } from '../domain/type/ClassConstructor';

export function instantiate<T>(plainValue: any, cstr: ClassConstructor<T>): T {
  return toInstance(cstr, plainValue);
}
