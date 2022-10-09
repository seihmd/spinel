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
    const graphNodeMetadata = this.findNodeMetadata(key);
    if (!graphNodeMetadata) {
      throw new Error(`Key "${key}" is not registered as ${GraphNode.name}`);
    }

    return graphNodeMetadata;
  }

  getRelationshipMetadata(key: string): GraphRelationshipMetadata {
    const graphRelationshipMetadata = this.findRelationshipMetadata(key);
    if (!graphRelationshipMetadata) {
      throw new Error(
        `Key "${key}" is not registered as ${GraphRelationship.name}`
      );
    }

    return graphRelationshipMetadata;
  }

  findBranchMetadata(key: string): GraphBranchMetadata | null {
    const metadata = this.map.get(key);
    if (metadata instanceof GraphBranchMetadata) {
      return metadata;
    }

    return null;
  }

  findNodeMetadata(key: string): GraphNodeMetadata | null {
    const metadata = this.map.get(key);
    if (metadata instanceof GraphNodeMetadata) {
      return metadata;
    }

    return null;
  }

  findRelationshipMetadata(key: string): GraphRelationshipMetadata | null {
    const metadata = this.map.get(key);
    if (metadata instanceof GraphRelationshipMetadata) {
      return metadata;
    }

    return null;
  }
}
