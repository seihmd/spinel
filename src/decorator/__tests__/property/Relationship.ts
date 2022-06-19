import 'reflect-metadata';
import { Relationship } from '../../property/Relationship';

describe('Relationship', () => {
  class Has {}

  test.each([
    [
      () => {
        class NodeClass {
          @Relationship('has', '<-')
          property?: NodeClass;
        }
      },
    ],
    [
      () => {
        class NodeClass {
          @Relationship(Has, '--')
          property?: NodeClass;
        }
      },
    ],
    [
      () => {
        class NodeClass {
          @Relationship(':HAS', '->')
          property?: NodeClass;
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
