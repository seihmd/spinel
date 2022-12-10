import { GraphRelationship } from 'decorator/property/GraphRelationship';
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

  class RelationshipClass {}

  test.each([
    [
      () => {
        class GraphClass {
          @GraphRelationship()
          rel?: RelationshipClass;
        }
      },
    ],
    [
      () => {
        class GraphClass {
          @GraphRelationship(RelationshipClass)
          rel?: RelationshipClass;
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
