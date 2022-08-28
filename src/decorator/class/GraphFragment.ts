import { getMetadataStore } from '../../metadata/store/MetadataStore';

export function GraphFragment(formula: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function _DecoratorName<T extends { new (...args: any[]): {} }>(
    cstr: T
  ) {
    getMetadataStore().registerGraphFragment(cstr, formula);
  };
}
