import { RelationshipEntity } from '../../class/RelationshipEntity';

describe('RelationshipEntity', () => {
  test.each([
    [
      () => {
        @RelationshipEntity()
        class RelationshipClass {}
      },
    ],
    [
      () => {
        @RelationshipEntity({ type: 'Alias' })
        class RelationshipClass {}
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
