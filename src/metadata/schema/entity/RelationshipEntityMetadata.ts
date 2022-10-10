import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';
import { Properties } from './Properties';
import { RelationshipConstraints } from '../constraint/RelationshipConstraints';

export class RelationshipEntityMetadata {
  private readonly cstr: AnyClassConstructor;
  private readonly type: RelationshipType;
  private readonly properties: Properties;
  private readonly constraints: RelationshipConstraints;

  constructor(
    cstr: AnyClassConstructor,
    type: RelationshipType,
    properties: Properties,
    constraints: RelationshipConstraints
  ) {
    this.constraints = constraints;
    this.cstr = cstr;
    this.type = type;
    this.properties = properties;
  }

  getCstr(): AnyClassConstructor {
    return this.cstr;
  }

  getType(): RelationshipType {
    return this.type;
  }

  getPrimary(): EntityPrimaryMetadata {
    return this.properties.getPrimary();
  }

  getProperties(): EntityPropertyMetadata[] {
    return this.properties.getProperties();
  }
}
