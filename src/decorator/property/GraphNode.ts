import { Expose, Type } from 'class-transformer';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { GraphNodePropertyType } from '../../metadata/schema/graph/GraphNodePropertyType';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';

export function GraphNode(type?: AnyClassConstructor): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    getMetadataStore().addGraphNode(
      target.constructor as AnyClassConstructor,
      GraphNodePropertyType.new(new ReflectedType(target, propertyKey)),
      type
    );
    Type()(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
