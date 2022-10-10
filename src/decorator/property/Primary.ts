import { Expose, Type } from 'class-transformer';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { Alias } from '../../metadata/schema/entity/Alias';
import { PrimaryType } from '../../metadata/schema/entity/PrimaryType';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { TransformerInterface } from '../../metadata/schema/transformation/transformer/TransformerInterface';

interface ConstraintOption {
  nodeKey?: string;
}

interface PrimaryOption {
  alias?: string;
  transformer?: TransformerInterface;
  constraint?: ConstraintOption;
}

export function Primary(option?: PrimaryOption): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const primaryType = PrimaryType.new(new ReflectedType(target, propertyKey));
    getMetadataStore().setPrimary(
      target.constructor as AnyClassConstructor,
      primaryType,
      option?.alias !== undefined ? new Alias(option.alias) : null,
      option?.transformer ?? null,
      option?.constraint?.nodeKey ?? null
    );

    Type()(target, propertyKey);
    Expose({ name: option?.alias })(target, propertyKey);
  };
}
