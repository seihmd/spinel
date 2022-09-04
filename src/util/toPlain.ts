import { instanceToPlain } from 'class-transformer';

export function toPlain(instance: Object): Record<string, unknown> {
  return instanceToPlain(instance, {
    excludeExtraneousValues: true,
  });
}
