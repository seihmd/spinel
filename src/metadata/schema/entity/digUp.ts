import { isRecord } from '../../../util/isRecord';
import { GraphMetadata } from '../graph/GraphMetadata';
import { NodeEntityMetadata } from './NodeEntityMetadata';
import { RelationshipEntityMetadata } from './RelationshipEntityMetadata';

export function digUp(
  plain: Record<string, unknown>,
  metadata: NodeEntityMetadata | RelationshipEntityMetadata | GraphMetadata
): Record<string, unknown> {
  if (metadata instanceof NodeEntityMetadata) {
    return digUpEntity(plain, metadata);
  } else if (metadata instanceof RelationshipEntityMetadata) {
    return digUpEntity(plain, metadata);
  } else {
    return digUpGraph(plain, metadata);
  }
}

function digUpEntity(
  plain: Record<string, unknown>,
  metadata: NodeEntityMetadata | RelationshipEntityMetadata
): Record<string, unknown> {
  let preserved: Record<string, unknown> = {};

  Object.entries(plain).forEach(([key, value]) => {
    if (!isRecord(value)) {
      preserved[key] = value;
      return;
    }
    const e = metadata.getEmbedMetadata(key);
    if (e) {
      preserved = { ...preserved, ...value };
    } else {
      preserved[key] = value;
    }
  });

  return preserved;
}

function digUpGraph(
  plain: Record<string, unknown>,
  metadata: GraphMetadata
): Record<string, unknown> {
  const restored: Record<string, unknown> = {};

  Object.entries(plain).forEach(([key, value]) => {
    const graphNodeMetadata = metadata.findGraphNodeMetadata(key);
    if (graphNodeMetadata) {
      restored[key] = digUpEntity(
        value as Record<string, unknown>,
        graphNodeMetadata.getEntityMetadata()
      );
      return;
    }

    const graphRelationshipMetadata =
      metadata.findGraphRelationshipMetadata(key);
    if (graphRelationshipMetadata) {
      restored[key] = digUpEntity(
        value as Record<string, unknown>,
        graphRelationshipMetadata.getEntityMetadata()
      );
      return;
    }

    restored[key] = value;
  });

  return restored;
}
