import { Expose, Type } from 'class-transformer';
import { AnyClassConstructor } from '../../metadata/types/ClassConstructor';
import { Direction } from '../../metadata/types/Direction';

export function Relationship(
  type: string | AnyClassConstructor,
  direction: Direction
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    Type()(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
