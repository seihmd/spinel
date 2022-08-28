import { Path } from '../../path/Path';
import { ElementFixture } from './ElementFixture';
import { Element } from '../../element/Element';

describe(`${Path.name}`, () => {
  const f = new ElementFixture();
  test('single Node graph', () => {
    expect(() => Path.new([f.newNodeElement()])).not.toThrowError();
  });

  test('N-R-N graph', () => {
    expect(() =>
      Path.new([
        f.newNodeElement(),
        f.newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
        f.newNodeElement(),
      ])
    ).not.toThrowError();
  });

  test.each([
    [
      [
        f.newNodeElement(),
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
      ],
    ],
    [
      [
        f.newDirectionElement('-'),
        f.newRelationshipElement(),
        f.newDirectionElement('-'),
      ],
    ],
    [[f.newDirectionElement('-')]],
    [[f.newRelationshipElement()]],
  ])('invalid ordered elements', (elements: Element[]) => {
    expect(() => Path.new(elements)).toThrowError();
  });
});
