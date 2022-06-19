import { GraphNode } from '../../../decorator/property/GraphNode';
import { ReflectedType } from '../../reflection/ReflectedType';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';

export class GraphNodePropertyType {
  static new(
    reflectedType: ReflectedType,
    type?: AnyClassConstructor
  ): GraphNodePropertyType {
    if (reflectedType.isArray()) {
      throw new Error(
        `type of ${
          GraphNode.name
        } property "${reflectedType.getPropertyKey()}" must not be Array`
      );
    }
    if (type) {
      if (!reflectedType.isObject() && !reflectedType.isConstructor()) {
        throw new Error(
          `Type of ${
            GraphNode.name
          } property "${reflectedType.getPropertyKey()}" must be constructor of NodeEntity`
        );
      }
      return new GraphNodePropertyType(reflectedType.getPropertyKey(), type);
    } else if (reflectedType.isConstructor()) {
      return new GraphNodePropertyType(
        reflectedType.getPropertyKey(),
        reflectedType.getType() as AnyClassConstructor
      );
    } else {
      throw new Error(
        `Type option of ${
          GraphNode.name
        } property "${reflectedType.getPropertyKey()}" must be specified`
      );
    }
  }

  private readonly type: AnyClassConstructor;
  private readonly propertyKey: string;

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
