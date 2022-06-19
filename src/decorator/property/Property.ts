import { Expose, Type } from 'class-transformer';

import { getMetadataStore } from '../../metadata/store/MetadataStore';

import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { Alias } from '../../metadata/schema/entity/Alias';
import { PropertyType } from '../../metadata/schema/entity/PropertyType';

interface PropertyOption {
  alias?: string;
}

export function Property(option?: PropertyOption): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    getMetadataStore().addProperty(
      target.constructor as AnyClassConstructor,
      PropertyType.new(new ReflectedType(target, propertyKey)),
      option?.alias !== undefined ? new Alias(option.alias) : null
    );

    Type()(target, propertyKey);
    Expose({ name: option?.alias })(target, propertyKey);
  };
}
