import { Path } from '../../path/Path';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { NodeElement } from '../../element/NodeElement';
import { PathStep } from '../../path/PathStep';
import { AnyNodeElement } from '../../element/Element';
import { BranchMaterialInterface } from './BranchMaterialInterface';

export class NodeBranchMaterial implements BranchMaterialInterface {
  private readonly path: Path;
  private readonly graphBranchMetadata: GraphBranchMetadata;

  constructor(path: Path, graphBranchMetadata: GraphBranchMetadata) {
    this.path = path;
    this.graphBranchMetadata = graphBranchMetadata;
  }

  getPath(): Path {
    return this.path;
  }

  getRootKey(): string {
    return this.path.getRoot().getGraphKey();
  }

  getGraphKey(): string {
    return this.graphBranchMetadata.getKey();
  }

  getTerminal(): NodeElement {
    const nodeElement = this.path.getTerminal();
    if (!(nodeElement instanceof NodeElement)) {
      throw new Error();
    }

    return nodeElement;
  }

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }

  getRootVariableName(): string {
    return this.path.getRoot().getVariableName();
  }

  getFilter(): string {
    return `${this.getTerminal().getVariableName()}{.*}`;
  }

  getNodeElement(): AnyNodeElement {
    throw new Error();
  }
}
