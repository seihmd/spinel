import { isRecord } from '../../../util/isRecord';
import { NodeEntityMetadata } from './NodeEntityMetadata';

export function digUp(
  plain: Record<string, unknown>,
  metadata: NodeEntityMetadata
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
