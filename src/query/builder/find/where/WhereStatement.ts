import { assignVariables } from '../../../literal/util/assignVariables';
import { VariableMap } from '../../../literal/util/VariableMap';

export class WhereStatement {
  constructor(private statement: string) {}

  assign(variableMap: VariableMap): string {
    return assignVariables(this.statement, variableMap);
  }
}
