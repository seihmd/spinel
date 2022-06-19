import { Graph } from '../../class/Graph';
import {
  injectMetadataStore,
  MetadataStore,
} from '../../../metadata/store/MetadataStore';
import { instance, mock } from 'ts-mockito';

describe('Graph', () => {
  beforeEach(() => {
    const metadataStore = mock(MetadataStore);
    injectMetadataStore(instance(metadataStore));
  });

  test.each([
    [
      () => {
        @Graph('formula')
        class GraphClass {}
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
