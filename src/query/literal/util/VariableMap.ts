import { camelCase } from 'lodash';
import { NodeElement } from '../../element/NodeElement';
import { Path } from '../../path/Path';

export class VariableMap {
  static withPath(path: Path, isGraphBranch = false): VariableMap {
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
      const graphKey = element.getWhereVariableName(
        isGraphBranch && index === elements.length - 1
      );
      if (graphKey === null) {
        return;
      }

      map.set(graphKey, element.getVariableName());
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
