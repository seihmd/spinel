import { ClassConstructor } from '../domain/type/ClassConstructor';
import { toInstance } from '../util/toInstance';

export function instantiate<T>(
  plainValue: unknown,
  cstr: ClassConstructor<T>
): T | T[] {
  return toInstance(cstr, plainValue);
}
