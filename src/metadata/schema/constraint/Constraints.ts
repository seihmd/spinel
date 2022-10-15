import { EntityPropertyMetadata } from '../entity/EntityPropertyMetadata';
import { EntityPrimaryMetadata } from '../entity/EntityPrimaryMetadata';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { NodeConstraints } from './NodeConstraints';
import { RelationshipConstraints } from './RelationshipConstraints';
import { RelationshipPropertyExistenceConstraint } from '../../../query/constraint/RelationshipPropertyExistenceConstraint';
import { NodePropertyExistenceConstraint } from '../../../query/constraint/NodePropertyExistenceConstraint';
import { NodeKeyConstraint } from '../../../query/constraint/NodeKeyConstraint';
import { UniquenessConstraint } from '../../../query/constraint/UniquenessConstraint';

type PropertyMetadata = EntityPropertyMetadata | EntityPrimaryMetadata;

export class Constraints {
  private readonly cstr: AnyClassConstructor;
  private readonly nodeKeyMap: Map<string, PropertyMetadata[]> = new Map();
  private readonly existenceProperties: PropertyMetadata[] = [];
  private readonly uniqueProperties: PropertyMetadata[] = [];

  constructor(cstr: AnyClassConstructor) {
    this.cstr = cstr;
  }

  addNodeKey(keyName: string, property: PropertyMetadata) {
    this.nodeKeyMap.set(keyName, [
      ...(this.nodeKeyMap.get(keyName) ?? []),
      property,
    ]);
  }

  addUnique(property: PropertyMetadata) {
    this.uniqueProperties.push(property);
  }

  addExistence(property: PropertyMetadata) {
    this.existenceProperties.push(property);
  }

  getCstr(): AnyClassConstructor {
    return this.cstr;
  }

  toNodeConstraints(label: NodeLabel): NodeConstraints {
    return new NodeConstraints(
      [...this.nodeKeyMap.entries()].map(([_, properties]) => {
        return new NodeKeyConstraint(
          label,
          properties.map((p) => p.getNeo4jKey())
        );
      }),
      this.existenceProperties.map((property) => {
        return new NodePropertyExistenceConstraint(
          label,
          property.getNeo4jKey()
        );
      }),
      this.uniqueProperties.map((property) => {
        return new UniquenessConstraint(label, property.getNeo4jKey());
      })
    );
  }

  toRelationshipConstraints(
    relationshipType: RelationshipType
  ): RelationshipConstraints {
    if (this.nodeKeyMap.size > 0) {
      throw new Error('Relationship cannot has NODE KEY constraint');
    }
    if (this.uniqueProperties.length > 0) {
      // TODO
      // throw new Error('Relationship cannot has UNIQUENESS constraint');
    }

    return new RelationshipConstraints(
      this.existenceProperties.map((property) => {
        return new RelationshipPropertyExistenceConstraint(
          relationshipType,
          property.getNeo4jKey()
        );
      })
    );
  }
}
