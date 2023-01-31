import { NodeLabel } from '../../domain/node/NodeLabel';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { IndexOption } from './IndexOption';

interface NodeEntityOption {
  unique?: string[];
  keys?: string[][];
  indexes?: IndexOption[];
}

export function NodeEntity(label: string, option?: NodeEntityOption) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function _DecoratorName<T extends { new (...args: any[]): {} }>(
    cstr: T
  ) {
    getMetadataStore().registerNode(
      cstr,
      new NodeLabel(label),
      option?.unique ?? [],
      option?.keys ?? [],
      option?.indexes ?? []
    );
  };
}
