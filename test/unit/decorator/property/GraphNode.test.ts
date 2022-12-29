import { GraphNode } from 'decorator/property/GraphNode';
import {
  injectMetadataStore,
  MetadataStore,
} from 'metadata/store/MetadataStore';
import 'reflect-metadata';
import { instance, mock } from 'ts-mockito';

describe('GraphNode', () => {
  beforeEach(() => {
    const metadataStore = mock(MetadataStore);
    injectMetadataStore(instance(metadataStore));
  });

  class NodeClass {}

  test.each([
    [
      () => {
        class GraphClass {
          @GraphNode()
          node?: NodeClass;
        }
      },
    ],
    [
      () => {
        class GraphClass {
          @GraphNode(NodeClass)
          nodes?: NodeClass;
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
