import { GraphFragment } from 'decorator/class/GraphFragment';
import {
  injectMetadataStore,
  MetadataStore,
} from 'metadata/store/MetadataStore';
import { instance, mock } from 'ts-mockito';

describe(`${GraphFragment.name}`, () => {
  beforeEach(() => {
    const metadataStore = mock(MetadataStore);
    injectMetadataStore(instance(metadataStore));
  });

  test.each([
    [
      () => {
        @GraphFragment('formula')
        class GraphFragmentClass {}
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
