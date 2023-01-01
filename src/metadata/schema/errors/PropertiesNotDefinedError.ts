import { Embeddable } from '../../../decorator/class/Embeddable';
import { NodeEntity } from '../../../decorator/class/NodeEntity';
import { RelationshipEntity } from '../../../decorator/class/RelationshipEntity';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';

export class PropertiesNotDefinedError extends Error {
  static node(cstr: AnyClassConstructor): PropertiesNotDefinedError {
    return new PropertiesNotDefinedError(NodeEntity.name, cstr);
  }

  static relationship(cstr: AnyClassConstructor): PropertiesNotDefinedError {
    return new PropertiesNotDefinedError(RelationshipEntity.name, cstr);
  }

  static embeddable(cstr: AnyClassConstructor): PropertiesNotDefinedError {
    return new PropertiesNotDefinedError(Embeddable.name, cstr);
  }

  private constructor(type: string, cstr: AnyClassConstructor) {
    super(`${type} class "${cstr.name}" must have at least 1 property.`);
  }
}
