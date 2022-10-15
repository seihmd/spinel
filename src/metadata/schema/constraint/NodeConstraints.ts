import { ConstraintInterface } from 'query/constraint/ConstraintInterface';
import { NodePropertyExistenceConstraint } from '../../../query/constraint/NodePropertyExistenceConstraint';
import { NodeKeyConstraint } from '../../../query/constraint/NodeKeyConstraint';
import { UniquenessConstraint } from '../../../query/constraint/UniquenessConstraint';

export class NodeConstraints {
  private readonly nodeKeys: NodeKeyConstraint[];
  private readonly existences: NodePropertyExistenceConstraint[];
  private readonly uniques: UniquenessConstraint[];

  constructor(
    nodeKeys: NodeKeyConstraint[],
    existences: NodePropertyExistenceConstraint[],
    uniques: UniquenessConstraint[]
  ) {
    this.nodeKeys = nodeKeys;
    this.existences = existences;
    this.uniques = uniques;
  }

  getAll(): ConstraintInterface[] {
    return [...this.nodeKeys, ...this.existences, ...this.uniques];
  }
}
