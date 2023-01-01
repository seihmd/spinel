import { getMetadataStore } from '../../metadata/store/MetadataStore';

export function Embeddable() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function _DecoratorName<T extends { new (...args: any[]): {} }>(
    cstr: T
  ) {
    getMetadataStore().registerEmbeddable(cstr);
  };
}
