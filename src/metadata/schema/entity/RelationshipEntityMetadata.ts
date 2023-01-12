import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { RelationshipConstraints } from '../constraint/RelationshipConstraints';
import { Indexes } from '../index/Indexes';
import { EntityEmbedMetadata } from './EntityEmbedMetadata';
import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';
import { Properties } from './Properties';

export class RelationshipEntityMetadata {
  private readonly cstr: AnyClassConstructor;
  private readonly type: RelationshipType;
  private readonly properties: Properties;
  private readonly constraints: RelationshipConstraints;
  private readonly indexes: Indexes;

  constructor(
    cstr: AnyClassConstructor,
    type: RelationshipType,
    properties: Properties,
    constraints: RelationshipConstraints,
    indexes: Indexes
  ) {
    this.constraints = constraints;
    this.cstr = cstr;
    this.type = type;
    this.properties = properties;
    this.indexes = indexes;
  }

  getCstr(): AnyClassConstructor {
    return this.cstr;
  }

  getType(): RelationshipType {
    return this.type;
  }

  getPrimary(): EntityPrimaryMetadata {
    const primary = this.properties.getPrimary();
    if (primary) {
      return primary;
    }
    throw new Error('RelationshipEntity must have primary property');
  }

  getProperties(): EntityPropertyMetadata[] {
    return this.properties.getProperties();
  }

  getEmbeds(): EntityEmbedMetadata[] {
    return this.properties.getEmbeds();
  }

  getEmbedMetadata(key: string): EntityEmbedMetadata | null {
    return (
      this.getEmbeds().find((embedMetadata) => {
        return embedMetadata.getKey() === key;
      }) ?? null
    );
  }

  getConstraints(): RelationshipConstraints {
    return this.constraints;
  }

  getIndexes(): Indexes {
    return this.indexes;
  }

  toNeo4jKey(key: string): string {
    return this.properties.toNeo4jKey(key);
  }

  toEmbeddedNeo4jKey(embedKey: string, propertyKey: string): string | null {
    return this.getEmbedMetadata(embedKey)?.toNeo4jKey(propertyKey) ?? null;
  }
}
