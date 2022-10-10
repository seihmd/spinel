import { NodeKeyConstraintMetadata } from './NodeKeyConstraintMetadata';
import { NodePropertyExistenceConstraintMetadata } from './NodePropertyExistenceConstraintMetadata';
import { UniquenessConstraintMetadata } from './UniquenessConstraintMetadata';

export class NodeConstraints {
  private readonly nodeKeys: NodeKeyConstraintMetadata[];
  private readonly existences: NodePropertyExistenceConstraintMetadata[];
  private readonly uniques: UniquenessConstraintMetadata[];

  constructor(
    nodeKeys: NodeKeyConstraintMetadata[],
    existences: NodePropertyExistenceConstraintMetadata[],
    uniques: UniquenessConstraintMetadata[]
  ) {
    this.nodeKeys = nodeKeys;
    this.existences = existences;
    this.uniques = uniques;
  }

  getNodeKeys(): NodeKeyConstraintMetadata[] {
    return this.nodeKeys;
  }

  getExistences(): NodePropertyExistenceConstraintMetadata[] {
    return this.existences;
  }

  getUniques(): UniquenessConstraintMetadata[] {
    return this.uniques;
  }
}
