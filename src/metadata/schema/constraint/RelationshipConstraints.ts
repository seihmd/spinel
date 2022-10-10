import { RelationshipPropertyExistenceConstraintMetadata } from './RelationshipPropertyExistenceConstraintMetadata';

export class RelationshipConstraints {
  private readonly existences: RelationshipPropertyExistenceConstraintMetadata[];

  constructor(existences: RelationshipPropertyExistenceConstraintMetadata[]) {
    this.existences = existences;
  }

  getExistences(): RelationshipPropertyExistenceConstraintMetadata[] {
    return this.existences;
  }
}
