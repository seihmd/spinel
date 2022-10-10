import { RelationshipPropertyExistenceConstraint } from '../../../../test/functional/query/constraint/RelationshipPropertyExistenceConstraint';

export class RelationshipConstraints {
  private readonly existences: RelationshipPropertyExistenceConstraint[];

  constructor(existences: RelationshipPropertyExistenceConstraint[]) {
    this.existences = existences;
  }

  getExistences(): RelationshipPropertyExistenceConstraint[] {
    return this.existences;
  }
}
