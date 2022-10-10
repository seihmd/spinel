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
  private readonly constraintMap: Map<string, Constraint> = new Map();

  constructor(constraints: Constraint[]) {
    this.constraintMap = new Map(
      constraints.map((constraint) => [constraint.getName(), constraint])
    );
  }

  diff(constraintDataList: ConstraintData[]): [Constraint[], string[]] {
    const toCreates: Constraint[] = [];
    const toDrops: string[] = [];

    const dataNames = constraintDataList.map(data => data.name);

    dataNames.forEach(name => {
      if (this.constraintMap.has(name)) {
        return;
      }

      toDrops.push(name);
    });

    [...this.constraintMap.entries()].forEach(([name, constraint]) => {
      if (dataNames.includes(name)) {
        return;
      }

      toCreates.push(constraint);
    });

    return [toCreates, toDrops];
  }
}
