import {
  AnyNodeElement,
  Element,
  EntityElement,
  isAnyNodeElement,
} from '../element/Element';
import { PathStep } from './PathStep';
import { reverseElement } from '../element/reverseElement';
import { BranchIndexes } from '../meterial/BranchIndexes';

export class Path {
  static new(elements: Element[]): Path {
    const [root, steps] = this.parse(elements);
    return new Path(root, steps);
  }

  private readonly root: AnyNodeElement;
  private readonly steps: PathStep[];

  constructor(root: AnyNodeElement, steps: PathStep[]) {
    this.root = root;
    this.steps = steps;
  }

  getRoot(): AnyNodeElement {
    return this.root;
  }

  getSteps(): PathStep[] {
    return this.steps;
  }

  getTerminal(): AnyNodeElement {
    return this.steps[this.steps.length - 1].getNode();
  }

  reverse(): Path {
    return Path.new(
      reverseElement([
        this.root,
        ...this.steps.reduce((elements: Element[], step) => {
          elements.push(
            step.getDirection1(),
            step.getRelationship(),
            step.getDirection2(),
            step.getNode()
          );

          return elements;
        }, []),
      ])
    );
  }

  findNodeElement(
    key: string,
    branchIndexes: BranchIndexes
  ): AnyNodeElement | null {
    if (
      this.getRoot().getGraphKey() === key &&
      this.getRoot().equalsBranchIndexes(branchIndexes)
    ) {
      return this.getRoot();
    }

    for (const step of this.getSteps()) {
      if (
        step.getNode().getGraphKey() === key &&
        step.getNode().equalsBranchIndexes(branchIndexes)
      ) {
        return step.getNode();
      }
    }

    return null;
  }

  getEntityElements(): EntityElement[] {
    return [
      this.getRoot(),
      ...this.getSteps()
        .map((step) => [step.getNode(), step.getRelationship()])
        .flat(),
    ];
  }

  private static parse(elements: Element[]): [AnyNodeElement, PathStep[]] {
    if (elements.length % 4 !== 1) {
      throw new Error(`Elements has unexpected length: ${elements.length}`);
    }
    if (!isAnyNodeElement(elements[0])) {
      throw new Error('Root of elements must be NodeElement');
    }

    return [elements[0], PathStep.new(elements.slice(1))];
  }
}
