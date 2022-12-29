import { camelCase } from 'lodash';
import { NodeElement } from '../../element/NodeElement';
import { BranchMaterialInterface } from '../../meterial/branch/BranchMaterialInterface';
import { NodeBranchMaterial } from '../../meterial/branch/NodeBranchMaterial';
import { Path } from '../../path/Path';

export class VariableMap {
  static withPath(
    path: Path,
    branchMaterial: BranchMaterialInterface | null = null
  ): VariableMap {
    const map: Map<string, string> = new Map();
    const rootKey = path.getRoot().getGraphParameterKey();

    if (rootKey !== null) {
      map.set(rootKey, path.getRoot().getVariableName());
    }

    const elements = path
      .getSteps()
      .map((step) => [step.getRelationship(), step.getNode()])
      .flat();

    elements.forEach((element, index) => {
      const graphKey = element.getWhereVariableName();
      if (graphKey === null) {
        return;
      }

      if (index === elements.length - 1 && branchMaterial) {
        if (branchMaterial instanceof NodeBranchMaterial) {
          map.set('@', element.getVariableName());
        } else {
          map.set('@.' + graphKey, element.getVariableName());
        }
      } else {
        map.set(graphKey, element.getVariableName());
      }
    });

    return new VariableMap(map);
  }

  static withNodeElement(nodeElement: NodeElement): VariableMap {
    return new VariableMap(
      new Map([
        [camelCase(nodeElement.getCstr().name), nodeElement.getVariableName()],
      ])
    );
  }

  constructor(private readonly map: Map<string, string>) {}

  get(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  sortedKeys(): string[] {
    return Array.from(this.map.keys()).sort((a, b) =>
      a.length > b.length ? -1 : 1
    );
  }
}
