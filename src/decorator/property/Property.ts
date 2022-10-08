import { Expose, Type } from 'class-transformer';

import { getMetadataStore } from '../../metadata/store/MetadataStore';

import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { Alias } from '../../metadata/schema/entity/Alias';
import { PropertyType } from '../../metadata/schema/entity/PropertyType';
import { Neo4jPropertyType } from '../../metadata/schema/entity/Neo4jPropertyType';

interface PropertyOption {
  alias?: string;
  type?: Neo4jPropertyType;
}

export function Property(option?: PropertyOption): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const propertyType = PropertyType.new(
      new ReflectedType(target, propertyKey)
    );
    getMetadataStore().addProperty(
      target.constructor as AnyClassConstructor,
      propertyType,
      option?.alias ? new Alias(option.alias) : null,
      option?.type ?? null
    );

    Type()(target, propertyKey);
    Expose({ name: option?.alias })(target, propertyKey);
  };
}
