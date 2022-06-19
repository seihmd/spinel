import { EndNode } from '../../property/EndNode';
import 'reflect-metadata';

describe('EndNode', () => {
  class NodeClass {}

  test.each([
    [
      () => {
        class RelationshipClass {
          @EndNode()
          property?: NodeClass;
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
