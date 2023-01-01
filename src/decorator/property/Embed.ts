import { Expose, Type } from 'class-transformer';

import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { PropertyType } from '../../metadata/schema/entity/PropertyType';

import { getMetadataStore } from '../../metadata/store/MetadataStore';

export function Embed(): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const propertyType = PropertyType.new(
      new ReflectedType(target, propertyKey)
    );

    getMetadataStore().addEmbed(
      target.constructor as AnyClassConstructor,
      propertyType
    );

    Type()(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
