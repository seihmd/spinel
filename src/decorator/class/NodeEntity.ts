import { getMetadataStore } from '../../metadata/store/MetadataStore';

import { NodeLabel } from '../../domain/node/NodeLabel';
import { IndexOption } from './IndexOption';

interface NodeEntityOption {
  label?: string;
  unique?: string[];
  keys?: string[][];
  indexes?: IndexOption[];
}

export function NodeEntity(option?: NodeEntityOption) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function _DecoratorName<T extends { new (...args: any[]): {} }>(
    cstr: T
  ) {
    getMetadataStore().registerNode(
      cstr,
      new NodeLabel(option?.label ?? cstr),
      option?.unique ?? [],
      option?.keys ?? [],
      option?.indexes ?? []
    );
  };
}
