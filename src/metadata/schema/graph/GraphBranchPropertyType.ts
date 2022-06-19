import { GraphBranch } from '../../../decorator/property/GraphBranch';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { ReflectedType } from '../../reflection/ReflectedType';

export class GraphBranchPropertyType {
  static new(
    reflectedType: ReflectedType,
    type: AnyClassConstructor
  ): GraphBranchPropertyType {
    if (!(reflectedType.isArray() || reflectedType.isObject())) {
      throw new Error(`type of ${GraphBranch.name} property must be Array`);
    }
    return new GraphBranchPropertyType(reflectedType.getPropertyKey(), type);
  }

  private readonly propertyKey: string;
  private readonly type: AnyClassConstructor;

  constructor(propertyKey: string, type: AnyClassConstructor) {
    this.propertyKey = propertyKey;
    this.type = type;
  }

  getKey(): string {
    return this.propertyKey;
  }

  getType(): AnyClassConstructor {
    return this.type;
  }
}
