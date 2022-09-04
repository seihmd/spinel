import { Path } from '../../path/Path';
import { PathStep } from '../../path/PathStep';
import { Branch } from '../../path/Branch';
import { MapEntry } from '../../literal/MapEntries';
import { MapLiteral } from '../../literal/MapLiteral';
import { MapEntryLiteral } from '../../literal/MapEntryLiteral';
import { BranchIndexes } from '../BranchIndexes';
import { AnyNodeElement } from '../../element/Element';
import { ElementContext } from '../../element/ElementContext';
import { BranchMaterialInterface } from './BranchMaterialInterface';

export class GraphBranchMaterial implements BranchMaterialInterface {
  private readonly path: Path;
  private readonly graphKey: string;

  constructor(path: Path, graphKey: string) {
    this.path = path;
    this.graphKey = graphKey;
  }

  getPath(): Path {
    return this.path;
  }

  getRootKey(): string {
    return this.path.getRoot().getGraphKey();
  }

  getGraphKey(): string {
    return this.graphKey;
  }

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }

  getRootVariableName(): string {
    return this.path.getRoot().getVariableName();
  }

  getFilter(branches: Branch[]): string {
    const entries: MapEntry[] = [];

    this.getSteps().forEach((step) => {
      if (step.getRelationship().getGraphKey() !== '') {
        entries.push([
          step.getRelationship().getGraphKey(),
          `${step.getRelationship().getVariableName()}{.*}`,
        ]);
      }
      if (step.getNode().getGraphKey() !== '') {
        entries.push([
          step.getNode().getGraphKey(),
          `${step.getNode().getVariableName()}{.*}`,
        ]);
      }
    });

    branches.forEach((branch) => {
      entries.push([
        branch.getGraphKey(),
        branch.toPatternComprehensionLiteral().get(),
      ]);
    });

    return new MapLiteral(MapEntryLiteral.new(entries)).get();
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
}
