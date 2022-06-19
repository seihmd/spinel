import { Expose, Type } from 'class-transformer';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { GraphRelationshipPropertyType } from '../../metadata/schema/graph/GraphRelationshipPropertyType';

export function GraphRelationship(
  type?: AnyClassConstructor
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    getMetadataStore().addGraphRelationship(
      target.constructor as AnyClassConstructor,
      GraphRelationshipPropertyType.new(new ReflectedType(target, propertyKey)),
      type
    );

    Type()(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
