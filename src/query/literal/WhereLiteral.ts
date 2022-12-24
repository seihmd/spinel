import { Path } from '../path/Path';
import { placeholder } from './util/placeholder';
import { VariableMap } from './util/VariableMap';

export class WhereLiteral {
  static new(query: string, path: Path): WhereLiteral {
    return new WhereLiteral(placeholder(query, VariableMap.withPath(path)));
  }

  static newWithVariableMap(
    query: string,
    variableMap: VariableMap
  ): WhereLiteral {
    return new WhereLiteral(placeholder(query, variableMap));
  }

  private readonly query: string;

  constructor(query: string) {
    this.query = query;
  }

  get(): string {
    return this.query;
  }
}
