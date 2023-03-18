import { Expose, Transform, Type } from 'class-transformer';

import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { Alias } from '../../metadata/schema/entity/Alias';
import { PropertyType } from '../../metadata/schema/entity/PropertyType';
import { getDefaultTransformer } from '../../metadata/schema/transformation/transformer/getDefaultTransformer';
import { TransformerInterface } from '../../metadata/schema/transformation/transformer/TransformerInterface';
import { getMetadataStore } from '../../metadata/store/MetadataStore';

interface PropertyOption {
  alias?: string;
  transformer?: TransformerInterface;
  type?: Function;
  notNull?: boolean;
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
      option?.notNull ?? false
    );

    Transform(
      (data): unknown => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const value = data.obj[option?.alias ?? data.key];
        return transformer.restore(value);
      },
      { toClassOnly: true }
    )(target, propertyKey);
    Type()(target, propertyKey);
    Expose({ name: option?.alias })(target, propertyKey);
  };
}
