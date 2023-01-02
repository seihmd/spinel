import { GraphMetadata } from '../graph/GraphMetadata';
import { NodeEntityMetadata } from './NodeEntityMetadata';
import { RelationshipEntityMetadata } from './RelationshipEntityMetadata';

export function embed(
  plain: Record<string, unknown>,
  metadata: NodeEntityMetadata | RelationshipEntityMetadata | GraphMetadata
): Record<string, unknown> {
  if (metadata instanceof NodeEntityMetadata) {
    return embedEntity(plain, metadata);
  } else if (metadata instanceof RelationshipEntityMetadata) {
    return embedEntity(plain, metadata);
  } else {
    return embedGraph(plain, metadata);
  }
}

function embedEntity(
  plain: Record<string, unknown>,
  metadata: NodeEntityMetadata | RelationshipEntityMetadata
): Record<string, unknown> {
  const restored: Record<string, unknown> = {};

  const embedMetadatas = metadata.getEmbeds();
  Object.entries(plain).forEach(([key, value]) => {
    const embedMetadata = embedMetadatas.find((m) => m.hasNeo4jKey(key));
    if (!embedMetadata) {
      restored[key] = value;
      return;
    }

    restored[embedMetadata.getKey()] ??= {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    restored[embedMetadata.getKey()][embedMetadata.toKey(key)] = value;
  });

  return restored;
}

function embedGraph(
  plain: Record<string, unknown>,
  metadata: GraphMetadata
): Record<string, unknown> {
  const restored: Record<string, unknown> = {};

  Object.entries(plain).forEach(([key, value]) => {
    const graphNodeMetadata = metadata.findGraphNodeMetadata(key);
    if (graphNodeMetadata) {
      restored[key] = embedEntity(
        value as Record<string, unknown>,
        graphNodeMetadata.getEntityMetadata()
      );
      return;
    }

    const graphRelationshipMetadata =
      metadata.findGraphRelationshipMetadata(key);
    if (graphRelationshipMetadata) {
      restored[key] = embedEntity(
        value as Record<string, unknown>,
        graphRelationshipMetadata.getEntityMetadata()
      );
      return;
    }

    restored[key] = value;
  });

  return restored;
}
