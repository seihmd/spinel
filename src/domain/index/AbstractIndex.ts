import { IndexType } from './IndexType';
import { IndexInterface } from './IndexInterface';
import { NodeLabel } from '../node/NodeLabel';
import { RelationshipType } from '../relationship/RelationshipType';

export abstract class AbstractIndex implements IndexInterface {
  protected readonly labelOrType: NodeLabel | RelationshipType;
  protected readonly on: string[];
  protected readonly options: string | null;
  protected readonly name: string | null;

  constructor(
    labelOrType: NodeLabel | RelationshipType,
    on: string[],
    options: string | null,
    name: string | null
  ) {
    this.name = name;
    this.labelOrType = labelOrType;
    this.on = on;
    this.options = options;
  }

  getLabelOrType(): NodeLabel | RelationshipType {
    return this.labelOrType;
  }

  abstract getIndexType(): IndexType;

  getProperties(): string[] {
    return this.on;
  }

  getOptions(): string | null {
    return this.options;
  }

  getName() {
    if (this.name !== null) {
      return this.name;
    }

    return this.getAutogeneratedName();
  }

  protected abstract getAutogeneratedName(): string;
}