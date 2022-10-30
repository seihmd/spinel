import { Path } from '../../path/Path';

export class VariableMap {
  private readonly map: Map<string, string>;

  public static new(path: Path, includesBranch = true): VariableMap {
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

  constructor(map: Map<string, string>) {
    this.map = map;
  }

  get(key: string): string | null {
    return this.map.get(key) ?? null;
  }
}
