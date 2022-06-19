import 'reflect-metadata';
import { StartNode } from '../../property/StartNode';

describe('StartNode', () => {
  class NodeClass {}

  test.each([
    [
      () => {
        class RelationshipClass {
          @StartNode()
          property?: NodeClass;
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
