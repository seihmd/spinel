import { Properties } from '../entity/Properties';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { EntityPrimaryMetadata } from '../entity/EntityPrimaryMetadata';
import { EntityPropertyMetadata } from '../entity/EntityPropertyMetadata';
import { RelationshipPropertyExistenceConstraint } from '../../../domain/constraint/RelationshipPropertyExistenceConstraint';

export class RelationshipConstraints {
  static new(
    type: RelationshipType,
    properties: Properties
  ): RelationshipConstraints {
    return new RelationshipConstraints(
      [properties.getPrimary(), ...properties.getProperties()]
        .filter(
          (m): m is EntityPrimaryMetadata | EntityPropertyMetadata =>
            m !== null && m.isNotNull()
        )
        .map(
          (m) =>
            new RelationshipPropertyExistenceConstraint(type, m.getNeo4jKey())
        )
    );
  }

  private readonly existences: RelationshipPropertyExistenceConstraint[];

  constructor(existences: RelationshipPropertyExistenceConstraint[]) {
    this.existences = existences;
  }

  getAll(): RelationshipPropertyExistenceConstraint[] {
    return this.existences;
  }
}
