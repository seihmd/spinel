import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from '../domain/type/ClassConstructor';

export function toInstance<T>(cstr: ClassConstructor<T>, plain: unknown): T {
  return plainToInstance(cstr, plain, {
    excludeExtraneousValues: true,
  });
}
