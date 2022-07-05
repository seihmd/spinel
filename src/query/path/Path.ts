import { AnyNodeElement, Element, isAnyNodeElement } from '../element/Element';
import { PathStep } from './PathStep';
import { NodeLabel } from '../../domain/node/NodeLabel';

export class Path {
  private readonly root: AnyNodeElement;
  private readonly steps: PathStep[];

  constructor(elements: Element[]) {
    const [root, steps] = this.parse(elements);
    this.root = root;
    this.steps = steps;
  }

  getRoot(): AnyNodeElement {
    return this.root;
  }

  getRootLabel(): NodeLabel {
    return this.root.getLabel();
  }

  getSteps(): PathStep[] {
    return this.steps;
  }

  private parse(elements: Element[]): [AnyNodeElement, PathStep[]] {
    if (elements.length % 4 !== 1) {
      throw new Error(`Elements has unexpected length: ${elements.length}`);
    }
    if (!isAnyNodeElement(elements[0])) {
      throw new Error('Root of elements must be NodeElement');
    }

    return [elements[0], PathStep.new(elements.slice(1))];
  }
}
