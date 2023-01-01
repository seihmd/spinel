import { NodeLabel } from '../../../domain/node/NodeLabel';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { NodeConstraints } from '../constraint/NodeConstraints';
import { BranchEndMetadata } from '../graph/BranchEndMetadata';
import { GraphNodeMetadata } from '../graph/GraphNodeMetadata';
import { GraphRelationshipMetadata } from '../graph/GraphRelationshipMetadata';
import { Indexes } from '../index/Indexes';
import { EntityEmbedMetadata } from './EntityEmbedMetadata';
import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';
import { Properties } from './Properties';

export class NodeEntityMetadata implements BranchEndMetadata {
  private readonly cstr: AnyClassConstructor;
  private readonly label: NodeLabel;
  private readonly properties: Properties;
  private readonly constraints: NodeConstraints;
  private readonly indexes: Indexes;

  constructor(
    cstr: AnyClassConstructor,
    label: NodeLabel,
    properties: Properties,
    constraints: NodeConstraints,
    indexes: Indexes
  ) {
    this.indexes = indexes;
    this.cstr = cstr;
    this.label = label;
    this.properties = properties;
    this.constraints = constraints;
  }

  getCstr(): AnyClassConstructor {
    return this.cstr;
  }

  getLabel(): NodeLabel {
    return this.label;
  }

  getPrimary(): EntityPrimaryMetadata {
    const primary = this.properties.getPrimary();
    if (primary) {
      return primary;
    }
    throw new Error('NodeEntity must have primary property');
  }

  getProperties(): EntityPropertyMetadata[] {
    return this.properties.getProperties();
  }

  getEmbeds(): EntityEmbedMetadata[] {
    return this.properties.getEmbeds();
  }

  getEmbedMetadata(key: string): EntityEmbedMetadata | null {
    return (
      this.getEmbeds().find((embedMetadata) => {
        return embedMetadata.getKey() === key;
      }) ?? null
    );
  }

  getGraphNodeMetadata(): GraphNodeMetadata {
    throw new Error();
  }

  getGraphRelationshipMetadata(): GraphRelationshipMetadata {
    throw new Error();
  }

  getConstraints(): NodeConstraints {
    return this.constraints;
  }

  getIndexes(): Indexes {
    return this.indexes;
  }
}
