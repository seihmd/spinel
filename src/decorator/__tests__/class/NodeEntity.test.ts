import { NodeEntity } from '../../class/NodeEntity';
import { instance, mock } from 'ts-mockito';
import {
  injectMetadataStore,
  MetadataStore,
} from '../../../metadata/store/MetadataStore';

describe('NodeEntity', () => {
  beforeEach(() => {
    const metadataStore = mock(MetadataStore);
    injectMetadataStore(instance(metadataStore));
  });

  test.each([
    [
      () => {
        @NodeEntity()
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity({ label: 'Alias' })
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity({ unique: ['p'] })
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity({ keys: [['p', 'p2']] })
        class NodeClass {}
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
