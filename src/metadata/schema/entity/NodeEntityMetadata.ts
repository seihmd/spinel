import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { EntityPrimaryMetadata } from './EntityPrimaryMetadata';
import { EntityPropertyMetadata } from './EntityPropertyMetadata';
import { Properties } from './Properties';

export class NodeEntityMetadata {
  private readonly cstr: AnyClassConstructor;
  private readonly label: NodeLabel;
  private readonly properties: Properties;

  constructor(
    cstr: AnyClassConstructor,
    label: NodeLabel,
    properties: Properties
  ) {
    this.cstr = cstr;
    this.label = label;
    this.properties = properties;
  }

  getCstr(): AnyClassConstructor {
    return this.cstr;
  }

  getLabel(): NodeLabel {
    return this.label;
  }

  getPrimary(): EntityPrimaryMetadata {
    return this.properties.getPrimary();
  }

  getProperties(): EntityPropertyMetadata[] {
    return this.properties.getProperties();
  }
}
