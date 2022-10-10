import { NodeLabel } from '../../../domain/node/NodeLabel';
import { EntityPropertyMetadata } from '../entity/EntityPropertyMetadata';
import { EntityPrimaryMetadata } from '../entity/EntityPrimaryMetadata';

export class NodePropertyExistenceConstraintMetadata {
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
    return `SPNL-npe-${this.label.toString()}-${this.propertyMetadata.getNeo4jKey()}`;
  }
}
