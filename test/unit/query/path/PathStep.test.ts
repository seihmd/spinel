import { Element } from 'query/element/Element';
import { PathStep } from 'query/path/PathStep';
import { ElementFixture } from './ElementFixture';

describe(`${PathStep.name}`, () => {
  const f = new ElementFixture();
  test.each([
    [
      [
        f.newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
        f.newNodeElement(),
      ],
      [
        new PathStep(
          f.newDirectionElement('-'),
          f.newRelationshipElement(),
          f.newDirectionElement('-'),
          f.newNodeElement()
        ),
      ],
    ],
    [
      [
        f.newDirectionElement('<-'),
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
          f.newDirectionElement('<-'),
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
