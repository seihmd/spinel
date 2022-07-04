import { GraphNodeMetadata } from './GraphNodeMetadata';
import { GraphRelationshipMetadata } from './GraphRelationshipMetadata';
import { GraphBranchMetadata } from './GraphBranchMetadata';
import { GraphRelationship } from '../../../decorator/property/GraphRelationship';
import { GraphNode } from '../../../decorator/property/GraphNode';

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

  getNodeMetadata(key: string): GraphNodeMetadata {
    const graphNodeMetadata = this.map.get(key);
    if (!graphNodeMetadata) {
      throw new Error(`${GraphNodeMetadata.name} with key "${key}" not found`);
    }
    if (!(graphNodeMetadata instanceof GraphNodeMetadata)) {
      throw new Error(`Key "${key}" is not registered as ${GraphNode.name}`);
    }

    return graphNodeMetadata;
  }

  getRelationshipMetadata(key: string): GraphRelationshipMetadata {
    const graphRelationshipMetadata = this.map.get(key);
    if (!graphRelationshipMetadata) {
      throw new Error(
        `${GraphRelationshipMetadata.name} with key "${key}" not found`
      );
    }
    if (!(graphRelationshipMetadata instanceof GraphRelationshipMetadata)) {
      throw new Error(
        `Key "${key}" is not registered as ${GraphRelationship.name}`
      );
    }

    return graphRelationshipMetadata;
  }
}
