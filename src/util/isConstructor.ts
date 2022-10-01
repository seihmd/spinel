import { AnyClassConstructor } from '../domain/type/ClassConstructor';

export function isConstructor(target: unknown): target is AnyClassConstructor {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Reflect.construct(String, [], target);
  } catch (e) {
    return false;
  }
  return true;
}
