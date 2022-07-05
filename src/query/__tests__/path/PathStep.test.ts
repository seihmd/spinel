import { ElementFixture } from './ElementFixture';
import { Element } from '../../element/Element';
import { PathStep } from '../../path/PathStep';

describe(`${PathStep.name}`, () => {
  const f = new ElementFixture();
  beforeEach(() => {
    f.reIndex();
  });

  test.each([
    [
      [
        f.reIndex(1).newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
        f.newNodeElement(),
      ],
      [
        new PathStep(
          f.reIndex(1).newDirectionElement('-'),
          f.newRelationshipElement(),
          f.newDirectionElement('-'),
          f.newNodeElement()
        ),
      ],
    ],
    [
      [
        f.reIndex(1).newDirectionElement('<-'),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
        f.newNodeElement(),
        f.newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newDirectionElement('->'),
        f.newNodeElement(),
      ],
      [
        new PathStep(
          f.reIndex(1).newDirectionElement('<-'),
          f.newRelationshipElement(),
          f.newDirectionElement('-'),
          f.newNodeElement()
        ),
        new PathStep(
          f.newDirectionElement('-'),
          f.newRelationshipElement(),
          f.newDirectionElement('->'),
          f.newNodeElement()
        ),
      ],
    ],
  ])('new', (elements: Element[], expected: PathStep[]) => {
    expect(JSON.stringify(PathStep.new(elements))).toBe(
      JSON.stringify(expected)
    );
  });

  test.each([
    [[f.newDirectionElement('-')]],
    [[f.newDirectionElement('-'), f.newRelationshipElement()]],
    [
      [
        f.newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
      ],
    ],
    [
      [
        f.newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
        f.newNodeElement(),
        f.newDirectionElement('-'),
      ],
    ],
  ])('invalid length elements', (elements: Element[]) => {
    expect(() => PathStep.new(elements)).toThrow(
      `Elements has unexpected length: ${elements.length}`
    );
  });

  test.each([
    [
      [
        f.newNodeElement(),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
        f.newNodeElement(),
      ],
    ],
    [
      [
        f.newDirectionElement('-'),
        f.newNodeElement(),
        f.newDirectionElement('-'),
        f.newNodeElement(),
      ],
    ],
    [
      [
        f.newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newNodeElement(),
        f.newNodeElement(),
      ],
    ],
    [
      [
        f.newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
        f.newDirectionElement('-'),
      ],
    ],
  ])('invalid ordered elements', (elements: Element[]) => {
    expect(() => PathStep.new(elements)).toThrow('Unexpected element');
  });
});
