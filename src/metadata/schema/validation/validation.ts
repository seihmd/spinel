import { NodeEntityMetadata } from '../entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../entity/RelationshipEntityMetadata';
import { GraphMetadata } from '../graph/GraphMetadata';

export type validation = (
  metadata: NodeEntityMetadata | RelationshipEntityMetadata | GraphMetadata
) => void;
