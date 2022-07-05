import { Branch } from './Branch';
import { PathStep } from './PathStep';
import { AnyNodeElement, Element } from '../element/Element';
import { Path } from './Path';

export class Stem {
  static new(elements: Element[], branches: Branch[]): Stem {
    return new Stem(new Path(elements), branches);
  }

  private readonly path: Path;
  private readonly branches: Branch[];

  constructor(path: Path, branches: Branch[]) {
    this.path = path;
    this.branches = branches;
  }

  getRoot(): AnyNodeElement {
    return this.path.getRoot();
  }

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }

  getBranches(): Branch[] {
    return this.branches;
  }
}
