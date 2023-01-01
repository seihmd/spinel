import { NodeEntityMetadata } from './NodeEntityMetadata';

export function embed(
  plain: Record<string, unknown>,
  metadata: NodeEntityMetadata
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
    restored[embedMetadata.getKey()][key] = value;
  });

  return restored;
}
