import { NodeEntity } from '../../class/NodeEntity';

describe('NodeEntity', () => {
  test.each([
    [
      () => {
        @NodeEntity()
        class NodeClass {}
      },
    ],
    [
      () => {
        @NodeEntity({ label: 'Alias' })
        class NodeClass {}
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });
});
