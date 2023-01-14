import { Expose, Type } from 'class-transformer';

import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { PropertyType } from '../../metadata/schema/entity/PropertyType';

import { getMetadataStore } from '../../metadata/store/MetadataStore';

type EmbedOption = {
  prefix: string;
};

export function Embed(option?: EmbedOption): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const propertyType = PropertyType.new(
      new ReflectedType(target, propertyKey)
    );

    getMetadataStore().addEmbed(
      target.constructor as AnyClassConstructor,
      propertyType,
      option?.prefix ?? ''
    );

    Type()(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
