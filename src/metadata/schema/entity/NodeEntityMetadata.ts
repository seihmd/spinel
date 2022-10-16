import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';
import { Properties } from './Properties';
import { BranchEndMetadata } from '../graph/BranchEndMetadata';
import { GraphRelationshipMetadata } from '../graph/GraphRelationshipMetadata';
import { GraphNodeMetadata } from '../graph/GraphNodeMetadata';
import { GraphPatternFormula } from '../../../domain/graph/pattern/formula/GraphPatternFormula';
import { NodeConstraints } from '../constraint/NodeConstraints';
import { Indexes } from '../index/Indexes';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  getGraphNodeMetadata(key: string): GraphNodeMetadata {
    throw new Error();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  getGraphRelationshipMetadata(key: string): GraphRelationshipMetadata {
    throw new Error();
  }

  getFormula(): GraphPatternFormula {
    return new GraphPatternFormula('*');
  }

  getConstraints(): NodeConstraints {
    return this.constraints;
  }

  getIndexes(): Indexes {
    return this.indexes;
  }
}
