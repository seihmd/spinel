import { ConstraintInterface } from 'query/constraint/ConstraintInterface';
import { NodePropertyExistenceConstraint } from '../../../query/constraint/NodePropertyExistenceConstraint';
import { NodeKeyConstraint } from '../../../query/constraint/NodeKeyConstraint';
import { UniquenessConstraint } from '../../../query/constraint/UniquenessConstraint';
import { Properties } from '../entity/Properties';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { EntityPrimaryMetadata } from '../entity/EntityPrimaryMetadata';
import { EntityPropertyMetadata } from '../entity/EntityPropertyMetadata';

export class NodeConstraints {
  static new(
    nodeKeysList: string[][],
    uniqueKeys: string[],
    label: NodeLabel,
    properties: Properties
  ): NodeConstraints {
    return new NodeConstraints(
      nodeKeysList.map(
        (nodeKeys) =>
          new NodeKeyConstraint(
            label,
            nodeKeys.map((nodeKey) => properties.toNeo4jKey(nodeKey))
          )
      ),
      [properties.getPrimary(), ...properties.getProperties()]
        .filter(
          (m): m is EntityPrimaryMetadata | EntityPropertyMetadata =>
            m !== null && m.isNotNull()
        )
        .map(
          (m) => new NodePropertyExistenceConstraint(label, m.getNeo4jKey())
        ),
      [properties.getPrimary()?.getKey(), ...uniqueKeys]
        .filter((key): key is string => key !== undefined)
        .map(
          (uniqueKey) =>
            new UniquenessConstraint(label, properties.toNeo4jKey(uniqueKey))
        )
    );
  }

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
