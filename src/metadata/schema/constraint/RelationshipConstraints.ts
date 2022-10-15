import { RelationshipPropertyExistenceConstraint } from 'query/constraint/RelationshipPropertyExistenceConstraint';

export class RelationshipConstraints {
  private readonly existences: RelationshipPropertyExistenceConstraint[];

  constructor(existences: RelationshipPropertyExistenceConstraint[]) {
    this.existences = existences;
  }

  getAll(): RelationshipPropertyExistenceConstraint[] {
    return this.existences;
  }
}
