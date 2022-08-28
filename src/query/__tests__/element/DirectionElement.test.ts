import { DirectionElement } from '../../element/DirectionElement';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';
import { Direction } from '../../../domain/graph/Direction';

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
