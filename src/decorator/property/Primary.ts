import { Expose, Type } from 'class-transformer';

interface PrimaryOption {
  alias?: string;
}

export function Primary(option?: PrimaryOption): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    Type()(target, propertyKey);
    Expose({ name: option?.alias })(target, propertyKey);
  };
}
