import { Expose, Transform, Type } from 'class-transformer';

import { getMetadataStore } from '../../metadata/store/MetadataStore';

import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { Alias } from '../../metadata/schema/entity/Alias';
import { PropertyType } from '../../metadata/schema/entity/PropertyType';
import { TransformerInterface } from '../../metadata/schema/transformation/transformer/TransformerInterface';
import { getDefaultTransformer } from '../../metadata/schema/transformation/transformer/getDefaultTransformer';

interface ConstraintOption {
  unique?: boolean;
  existence?: boolean;
  nodeKey?: string;
}

interface PropertyOption {
  alias?: string;
  transformer?: TransformerInterface;
  constraint?: ConstraintOption;
}

export function Property(option?: PropertyOption): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const propertyType = PropertyType.new(
      new ReflectedType(target, propertyKey)
    );
    const transformer =
      option?.transformer ?? getDefaultTransformer(propertyType);

    getMetadataStore().addProperty(
      target.constructor as AnyClassConstructor,
      propertyType,
      option?.alias ? new Alias(option.alias) : null,
      transformer,
      option?.constraint?.unique ?? false,
      option?.constraint?.existence ?? false,
      option?.constraint?.nodeKey ?? null
    );

    Transform(
      ({ value }): unknown => {
        return transformer.restore(value);
      },
      { toClassOnly: true }
    )(target, propertyKey);
    Type()(target, propertyKey);
    Expose({ name: option?.alias })(target, propertyKey);
  };
}
