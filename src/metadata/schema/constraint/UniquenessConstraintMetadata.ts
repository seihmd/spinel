import { EntityPropertyMetadata } from '../entity/EntityPropertyMetadata';
import { EntityPrimaryMetadata } from '../entity/EntityPrimaryMetadata';
import { NodeLabel } from '../../../domain/node/NodeLabel';

export class UniquenessConstraintMetadata {
  private readonly label: NodeLabel;
  private readonly propertyMetadata:
    | EntityPropertyMetadata
    | EntityPrimaryMetadata;

  constructor(
    label: NodeLabel,
    propertyMetadata: EntityPropertyMetadata | EntityPrimaryMetadata
  ) {
    this.label = label;
    this.propertyMetadata = propertyMetadata;
  }

  getName(): string {
    return `SPNL-u-${this.label.toString()}-${this.propertyMetadata.getNeo4jKey()}`;
  }
}
