import {
  getMetadataStore,
  injectMetadataStore,
  MetadataStore,
} from 'metadata/store/MetadataStore';

describe('getMetadataStore', () => {
  test('getMetadataStore return singleton', () => {
    expect(getMetadataStore()).toBe(getMetadataStore());
  });

  test('injectMetadataStore change instance', () => {
    const m1 = getMetadataStore();
    injectMetadataStore(new MetadataStore());
    const m2 = getMetadataStore();

    expect(m1).not.toBe(m2);
    expect(m2).toBe(getMetadataStore());
  });
});
