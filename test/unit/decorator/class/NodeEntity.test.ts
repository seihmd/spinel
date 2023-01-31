import { NodeEntity } from 'decorator/class/NodeEntity';
import {
  injectMetadataStore,
  MetadataStore,
} from 'metadata/store/MetadataStore';
import { instance, mock } from 'ts-mockito';

describe('NodeEntity', () => {
  beforeEach(() => {
    const metadataStore = mock(MetadataStore);
    injectMetadataStore(instance(metadataStore));
  });

  test.each([
    [
      () => {
        @NodeEntity('Node')
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity('Node', { label: 'Alias' })
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity('Node', { unique: ['p'] })
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity('Node', { keys: [['p', 'p2']] })
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity('Node', {
          indexes: [
            {
              type: 'text',
              on: ['p1'],
            },
          ],
        })
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity('Node', {
          indexes: [
            {
              name: 'index_NodeClass_p1',
              type: 'btree',
              on: ['p1'],
              options:
                '{indexConfig: {`spatial.cartesian.min`: [-100.0, -100.0], ' +
                '`spatial.cartesian.max`: [100.0, 100.0]}}',
            },
          ],
        })
        class NodeClass {}
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
