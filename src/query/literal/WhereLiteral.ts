import { Path } from '../path/Path';
import { assignVariables } from './util/assignVariables';
import { VariableMap } from './util/VariableMap';

export class WhereLiteral {
  static new(statement: string, path: Path): WhereLiteral {
    return new WhereLiteral(
      assignVariables(statement, VariableMap.withPath(path))
    );
  }

  static newWithVariableMap(
    statement: string,
    variableMap: VariableMap
  ): WhereLiteral {
    return new WhereLiteral(assignVariables(statement, variableMap));
  }

  private readonly query: string;

  constructor(query: string) {
    this.query = query;
  }

  get(): string {
    return this.query;
  }
}
