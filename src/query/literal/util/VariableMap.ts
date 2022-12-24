import { camelCase } from 'lodash';
import { NodeElement } from '../../element/NodeElement';
import { Path } from '../../path/Path';

export class VariableMap {
  static withPath(path: Path, includesBranch = true): VariableMap {
    const map: Map<string, string> = new Map();
    const rootKey = path.getRoot().getGraphParameterKey();

    if (rootKey !== null) {
      map.set(rootKey, path.getRoot().getVariableName());
    }

    const elements = path
      .getSteps()
      .map((step) => [step.getRelationship(), step.getNode()])
      .flat();

    if (includesBranch) {
      for (const element of elements) {
        const graphKey = element.getWhereVariableName();
        if (graphKey === null) {
          continue;
        }

        map.set(graphKey, element.getVariableName());
      }
    }

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
}
