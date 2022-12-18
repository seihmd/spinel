import { placeholder } from '../../literal/util/placeholder';
import { VariableMap } from '../../literal/util/VariableMap';

export class WhereStatement {
  constructor(private statement: string) {}

  assign(variableMap: VariableMap): string {
    return placeholder(this.statement, variableMap);
  }
}
