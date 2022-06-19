import { getMetadataStore } from '../../metadata/store/MetadataStore';

import { NodeLabel } from '../../domain/node/NodeLabel';

interface NodeEntityOption {
  label?: string;
}

export function NodeEntity(option?: NodeEntityOption) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function _DecoratorName<T extends { new (...args: any[]): {} }>(
    cstr: T
  ) {
    getMetadataStore().registerNode(cstr, new NodeLabel(option?.label ?? cstr));
  };
}
