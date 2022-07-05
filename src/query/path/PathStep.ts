import { DirectionElement } from '../element/DirectionElement';
import {
  AnyNodeElement,
  AnyRelationshipElement,
  Element,
  isAnyNodeElement,
  isAnyRelationshipElement,
} from '../element/Element';

export class PathStep {
  static new(elements: Element[]): PathStep[] {
    if (elements.length % 4 !== 0) {
      throw new Error(`Elements has unexpected length: ${elements.length}`);
    }

    const steps: PathStep[] = [];
    for (let i = 0; i < elements.length; i += 4) {
      const el0 = elements[i];
      const el1 = elements[i + 1];
      const el2 = elements[i + 2];
      const el3 = elements[i + 3];

      if (
        !(el0 instanceof DirectionElement) ||
        !isAnyRelationshipElement(el1) ||
        !(el2 instanceof DirectionElement) ||
        !isAnyNodeElement(el3)
      ) {
        throw new Error('Unexpected element');
      }

      steps.push(new PathStep(el0, el1, el2, el3));
    }

    return steps;
  }

  private readonly dir1: DirectionElement;
  private readonly r: AnyRelationshipElement;
  private readonly dir2: DirectionElement;
  private readonly n: AnyNodeElement;

  constructor(
    dir1: DirectionElement,
    r: AnyRelationshipElement,
    dir2: DirectionElement,
    n: AnyNodeElement
  ) {
    this.dir1 = dir1;
    this.r = r;
    this.dir2 = dir2;
    this.n = n;
  }

  getDirection1(): DirectionElement {
    return this.dir1;
  }

  getRelationship(): AnyRelationshipElement {
    return this.r;
  }

  getDirection2(): DirectionElement {
    return this.dir2;
  }

  getNode(): AnyNodeElement {
    return this.n;
  }
}
