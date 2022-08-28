import { placeholder } from './placeholder';
import { Path } from '../path/Path';

export class WhereLiteral {
  static new(query: string, path: Path): WhereLiteral {
    const variableMap: { [key: string]: string } = {};

    const rootKey = path.getRoot().getGraphParameterKey();
    if (rootKey !== null) {
      variableMap[rootKey] = path.getRoot().getVariableName();
    }

    const elements = path
      .getSteps()
      .map((step) => [step.getRelationship(), step.getNode()])
      .flat();

    for (const element of elements) {
      const graphKey = element.getWhereVariableName();
      if (graphKey === null) {
        continue;
      }

      variableMap[graphKey] = element.getVariableName();
    }

    return new WhereLiteral(query, variableMap);
  }

  private readonly query: string;
  private readonly variableMap: { [key: string]: string };

  constructor(query: string, variableMap: { [key: string]: string }) {
    this.query = query;
    this.variableMap = variableMap;
  }

  get(): string {
    return placeholder(this.query, this.variableMap);
  }
}
