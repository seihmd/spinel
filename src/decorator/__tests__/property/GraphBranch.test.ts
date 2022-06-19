import 'reflect-metadata';
import { instance, mock } from 'ts-mockito';
import {
  injectMetadataStore,
  MetadataStore,
} from '../../../metadata/store/MetadataStore';
import { GraphBranch } from '../../property/GraphBranch';

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
          @GraphBranch(NodeClass, ['prop', 'branchProp'])
          nodes: NodeClass[] = [];
        }
      },
    ],
    [
      () => {
        class GraphClass {
          @GraphBranch(NodeClass, ['prop', 'branchProp'], 2)
          nodes: NodeClass[] = [];
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
