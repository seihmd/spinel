import { NodeLabel } from '../../../domain/node/NodeLabel';
import { EntityPropertyMetadata } from '../entity/EntityPropertyMetadata';
import { EntityPrimaryMetadata } from '../entity/EntityPrimaryMetadata';

export class NodeKeyConstraintMetadata {
  private readonly label: NodeLabel;
  private readonly propertyMetadataList: (
    | EntityPropertyMetadata
    | EntityPrimaryMetadata
  )[];

  constructor(
    label: NodeLabel,
    propertyMetadataList: (EntityPropertyMetadata | EntityPrimaryMetadata)[]
  ) {
    this.label = label;
    this.propertyMetadataList = propertyMetadataList;
  }

  getName(): string {
    const keys = this.propertyMetadataList
      .map((p) => p.getNeo4jKey())
      .sort()
      .join('-');

    return `SPNL-nk-${this.label.toString()}-${keys}`;
  }
}
