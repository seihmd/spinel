import { Expose, Type } from 'class-transformer';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { Alias } from '../../metadata/schema/entity/Alias';
import { PrimaryType } from '../../metadata/schema/entity/PrimaryType';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { Neo4jPropertyType } from '../../metadata/schema/entity/Neo4jPropertyType';

interface PrimaryOption {
  alias?: string;
  type?: Neo4jPropertyType;
}

export function Primary(option?: PrimaryOption): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    getMetadataStore().setPrimary(
      target.constructor as AnyClassConstructor,
      PrimaryType.new(new ReflectedType(target, propertyKey)),
      option?.alias !== undefined ? new Alias(option.alias) : null,
      option?.type ?? null
    );

    Type()(target, propertyKey);
    Expose({ name: option?.alias })(target, propertyKey);
  };
}
