import { Expose, Type } from 'class-transformer';

interface PropertyOption {
  alias?: string;
}

export function Property(option?: PropertyOption): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    Type()(target, propertyKey);
    Expose({ name: option?.alias })(target, propertyKey);
  };
}
