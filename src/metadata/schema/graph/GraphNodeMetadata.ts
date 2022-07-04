import { GraphNodePropertyType } from './GraphNodePropertyType';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { NodeEntityMetadata } from '../entity/NodeEntityMetadata';
import { NodeLabel } from '../../../domain/node/NodeLabel';

export class GraphNodeMetadata {
  private readonly propertyType: GraphNodePropertyType;
  private readonly entityMetadata: NodeEntityMetadata;

  constructor(
    propertyType: GraphNodePropertyType,
    entityMetadata: NodeEntityMetadata
  ) {
    this.propertyType = propertyType;
    this.entityMetadata = entityMetadata;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getCstr(): AnyClassConstructor {
    return this.propertyType.getType();
  }

  getEntityMetadata(): NodeEntityMetadata {
    return this.entityMetadata;
  }

  getLabel(): NodeLabel {
    return this.entityMetadata.getLabel();
  }
}
