import { isRecord } from '../../../util/isRecord';
import { GraphFragmentMetadata } from '../graph/GraphFragmentMetadata';
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
    const embedMetadata = metadata.getEmbedMetadata(key);
    if (embedMetadata) {
      preserved = {
        ...preserved,
        ...Object.entries(value).reduce(
          (prefixed: Record<string, unknown>, [k, v]) => {
            prefixed[embedMetadata.toNeo4jKey(k)] = v;
            return prefixed;
          },
          {}
        ),
      };
    } else {
      preserved[key] = value;
    }
  });

  return preserved;
}

function digUpGraph(
  plain: Record<string, unknown>,
  metadata: GraphMetadata | GraphFragmentMetadata
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

    const branchEndMetadata = metadata
      .findBranchMetadata(key)
      ?.getBranchEndMetadata();
    if (branchEndMetadata && branchEndMetadata instanceof NodeEntityMetadata) {
      if (Array.isArray(value)) {
        restored[key] = value.map((v) =>
          digUpEntity(v as Record<string, unknown>, branchEndMetadata)
        );
      } else {
        restored[key] = digUpEntity(
          value as Record<string, unknown>,
          branchEndMetadata
        );
      }
      return;
    }

    if (branchEndMetadata) {
      if (Array.isArray(value)) {
        restored[key] = value.map((v) =>
          digUpGraph(v as Record<string, unknown>, branchEndMetadata)
        );
      } else {
        restored[key] = digUpGraph(
          value as Record<string, unknown>,
          branchEndMetadata
        );
      }
      return;
    }

    restored[key] = value;
  });

  return restored;
}
