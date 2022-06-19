import { Expose, Type } from 'class-transformer';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { GraphBranchPropertyType } from '../../metadata/schema/graph/GraphBranchPropertyType';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';

export function GraphBranch(
  type: AnyClassConstructor,
  keyMapping: [string, string],
  depth = 1
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const reflectedType = new ReflectedType(target, propertyKey);
    getMetadataStore().addGraphBranch(
      target.constructor as AnyClassConstructor,
      GraphBranchPropertyType.new(reflectedType, type),
      keyMapping,
      depth
    );

    Type()(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
