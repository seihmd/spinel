import { ConstraintData } from './ConstraintData';
import { NodeKeyConstraint } from './NodeKeyConstraint';
import { NodePropertyExistenceConstraint } from './NodePropertyExistenceConstraint';
import { RelationshipPropertyExistenceConstraint } from './RelationshipPropertyExistenceConstraint';
import { UniquenessConstraint } from './UniquenessConstraint';

type Constraint =
  | NodeKeyConstraint
  | NodePropertyExistenceConstraint
  | RelationshipPropertyExistenceConstraint
  | UniquenessConstraint;

export class ConstraintList {
  private readonly constraints: Constraint[];

  static new(objects: ConstraintData[]) {
    return new ConstraintList(
      objects.map((object) => {
        if (object.type === 'UNIQUENESS') {
          return UniquenessConstraint.withData(object);
        }

        if (object.type === 'NODE_PROPERTY_EXISTENCE') {
        }

        if (object.type === 'RELATIONSHIP_PROPERTY_EXISTENCE') {
        }

        if (object.type === 'NODE_KEY') {
        }

        throw new Error(`Unexpected constraint type "${object.type}"`);
      })
    );
  }

  constructor(constraints: Constraint[]) {
    this.constraints = constraints;
  }
}
