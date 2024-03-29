import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import {
  injectMetadataStore,
  MetadataStore,
} from 'metadata/store/MetadataStore';
import { instance, mock } from 'ts-mockito';

describe('RelationshipEntity', () => {
  beforeEach(() => {
    const metadataStore = mock(MetadataStore);
    injectMetadataStore(instance(metadataStore));
  });

  test.each([
    [
      () => {
        @RelationshipEntity('RELATIONSHIP')
        class RelationshipClass {}
      },
    ],
    [
      () => {
        @RelationshipEntity('RELATIONSHIP', { type: 'Alias' })
        class RelationshipClass {}
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
