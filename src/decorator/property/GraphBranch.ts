import { Expose, Transform, TransformFnParams, Type } from 'class-transformer';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { GraphBranchPropertyType } from '../../metadata/schema/graph/GraphBranchPropertyType';
import { ReflectedType } from '../../metadata/reflection/ReflectedType';
import { AssociationPatternFormula } from '../../domain/graph/pattern/formula/AssociationPatternFormula';

export function GraphBranch(
  type: AnyClassConstructor,
  associationPatternFormula: string,
  depth = 1
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const reflectedType = new ReflectedType(target, propertyKey);
    getMetadataStore().addGraphBranch(
      target.constructor as AnyClassConstructor,
      GraphBranchPropertyType.new(reflectedType, type),
      new AssociationPatternFormula(associationPatternFormula),
      depth
    );

    Type(() => type)(target, propertyKey);
    Transform((params: TransformFnParams) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return params.value !== null && params.value !== undefined
        ? params.value
        : [];
    })(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
