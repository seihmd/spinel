import { NodeKeyConstraint } from '../../../../test/functional/query/constraint/NodeKeyConstraint';
import { NodePropertyExistenceConstraint } from '../../../../test/functional/query/constraint/NodePropertyExistenceConstraint';
import { UniquenessConstraint } from '../../../../test/functional/query/constraint/UniquenessConstraint';

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

  getNodeKeys(): NodeKeyConstraint[] {
    return this.nodeKeys;
  }

  getExistences(): NodePropertyExistenceConstraint[] {
    return this.existences;
  }

  getUniques(): UniquenessConstraint[] {
    return this.uniques;
  }
}
