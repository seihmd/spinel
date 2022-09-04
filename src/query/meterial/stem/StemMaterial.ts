import { Path } from '../../path/Path';
import { PathStep } from '../../path/PathStep';
import { BranchIndexes } from '../BranchIndexes';
import { AnyNodeElement, InstanceElement } from '../../element/Element';
import { ElementContext } from '../../element/ElementContext';

export class StemMaterial {
  private readonly path: Path;

  constructor(path: Path) {
    this.path = path;
  }

  getPath(): Path {
    return this.path;
  }

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }

  getNodeElement(key: string, branchIndexes: BranchIndexes): AnyNodeElement {
    const nodeElement = this.path.findNodeElement(key, branchIndexes);
    if (nodeElement) {
      return nodeElement.withContext(
        new ElementContext(branchIndexes, nodeElement.getIndex(), false)
      );
    }

    throw new Error(`Node element with key "${key}" not found`);
  }

  getInstanceElements(): InstanceElement[] {
    return this.path.getInstanceElements();
  }
}
