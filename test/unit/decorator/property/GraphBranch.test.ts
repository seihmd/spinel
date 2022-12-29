import { GraphBranch } from 'decorator/property/GraphBranch';
import {
  injectMetadataStore,
  MetadataStore,
} from 'metadata/store/MetadataStore';
import 'reflect-metadata';
import { instance, mock } from 'ts-mockito';

describe('GraphBranch', () => {
  beforeEach(() => {
    const metadataStore = mock(MetadataStore);
    injectMetadataStore(instance(metadataStore));
  });

  class NodeClass {}

  test.each([
    [
      () => {
        class GraphClass {
          @GraphBranch(NodeClass, 'n-[:r]->.n2')
          nodes: NodeClass[] = [];
        }
      },
    ],
    [
      () => {
        class GraphClass {
          @GraphBranch(NodeClass, 'n-[:r]->.n2', 2)
          nodes: NodeClass[] = [];
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
