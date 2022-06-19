import { GraphRelationship } from '../../../decorator/property/GraphRelationship';
import { ReflectedType } from '../../reflection/ReflectedType';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';

export class GraphRelationshipPropertyType {
  static new(
    reflectedType: ReflectedType,
    type?: AnyClassConstructor
  ): GraphRelationshipPropertyType {
    if (reflectedType.isArray()) {
      throw new Error(
        `type of ${GraphRelationship.name} property must not be Array`
      );
    }
    if (type) {
      if (!reflectedType.isObject() && !reflectedType.isConstructor()) {
        throw new Error(
          `Type of ${
            GraphRelationship.name
          } property "${reflectedType.getPropertyKey()}" must be constructor of RelationshipEntity`
        );
      }
      return new GraphRelationshipPropertyType(
        reflectedType.getPropertyKey(),
        type
      );
    } else if (reflectedType.isConstructor()) {
      return new GraphRelationshipPropertyType(
        reflectedType.getPropertyKey(),
        reflectedType.getType() as AnyClassConstructor
      );
    } else {
      throw new Error(
        `Type option of ${
          GraphRelationship.name
        } property "${reflectedType.getPropertyKey()}" must be specified`
      );
    }
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
