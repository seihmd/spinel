import { Direction } from 'domain/graph/Direction';
import { DirectionTerm } from 'domain/graph/pattern/term/DirectionTerm';
import { DirectionElement } from 'query/element/DirectionElement';

describe(`${DirectionElement.name}`, () => {
  test.each([
    ['<-', '->'],
    ['->', '<-'],
    ['-', '-'],
  ] as [Direction, Direction][])(
    'reverse',
    (termValue: Direction, expected: Direction) => {
      expect(
        new DirectionElement(new DirectionTerm(termValue)).reverse()
      ).toStrictEqual(new DirectionElement(new DirectionTerm(expected)));
    }
  );
});
