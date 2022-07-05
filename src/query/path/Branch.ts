import { Path } from './Path';
import { AnyNodeElement, Element } from '../element/Element';

export class Branch {
  static new(
    elements: Element[],
    root: AnyNodeElement,
    propertyKey: string,
    branches: Branch[]
  ): Branch {
    return new Branch(new Path(elements), root, propertyKey, branches);
  }

  private readonly path: Path;
  private readonly root: AnyNodeElement;
  private readonly propertyKey: string;
  private readonly branches: Branch[];

  constructor(
    path: Path,
    root: AnyNodeElement,
    propertyKey: string,
    branches: Branch[]
  ) {
    if (path.getRootLabel().toString() !== root.getLabel().toString()) {
      throw new Error();
    }

    this.path = path;
    this.root = root;
    this.propertyKey = propertyKey;
    this.branches = branches;
  }

  getPath(): Path {
    return this.path;
  }

  getRoot(): AnyNodeElement {
    return this.root;
  }

  getPropertyKey(): string {
    return this.propertyKey;
  }

  getBranches(): Branch[] {
    return this.branches;
  }
}
