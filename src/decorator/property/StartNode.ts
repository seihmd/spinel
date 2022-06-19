import { Expose, Type } from 'class-transformer';

export function StartNode(): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    Type()(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
