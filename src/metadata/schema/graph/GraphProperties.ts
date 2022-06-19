import { GraphNodeMetadata } from './GraphNodeMetadata';
import { GraphRelationshipMetadata } from './GraphRelationshipMetadata';
import { GraphBranchMetadata } from './GraphBranchMetadata';

type PropertyMetadata =
  | GraphNodeMetadata
  | GraphRelationshipMetadata
  | GraphBranchMetadata;

export class GraphProperties {
  private map: Map<string, PropertyMetadata> = new Map();

  set(property: PropertyMetadata): void {
    if (this.map.has(property.getKey())) {
      throw new Error(`Graph property key "${property.getKey()}" already set`);
    }

    this.map.set(property.getKey(), property);
  }

  getNodesMetadata(): GraphNodeMetadata[] {
    return [...this.map.values()].filter(
      (propertyMetadata): propertyMetadata is GraphNodeMetadata =>
        propertyMetadata instanceof GraphNodeMetadata
    );
  }

  getRelationshipsMetadata(): GraphRelationshipMetadata[] {
    return [...this.map.values()].filter(
      (propertyMetadata): propertyMetadata is GraphRelationshipMetadata =>
        propertyMetadata instanceof GraphRelationshipMetadata
    );
  }

  getBranchesMetadata(): GraphBranchMetadata[] {
    return [...this.map.values()].filter(
      (propertyMetadata): propertyMetadata is GraphBranchMetadata =>
        propertyMetadata instanceof GraphBranchMetadata
    );
  }
}
