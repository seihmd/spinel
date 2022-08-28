import { DirectionElement } from './DirectionElement';
import { Element } from './Element';

export function reverseElement(elements: Element[]) {
  return [...elements].reverse().map((element) => {
    if (!(element instanceof DirectionElement)) {
      return element;
    }
    return element.reverse();
  });
}
