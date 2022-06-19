import { Expose, Type } from 'class-transformer';

export function EndNode(): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    Type()(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
