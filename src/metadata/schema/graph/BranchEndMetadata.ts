import { GraphNodeMetadata } from './GraphNodeMetadata';
import { GraphRelationshipMetadata } from './GraphRelationshipMetadata';

export interface BranchEndMetadata {
  getGraphNodeMetadata(key: string): GraphNodeMetadata;

  getGraphRelationshipMetadata(key: string): GraphRelationshipMetadata;
}
