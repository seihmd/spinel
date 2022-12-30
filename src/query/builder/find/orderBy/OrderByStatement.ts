import { Sort } from '../../../literal/OrderByLiteral';
import { assignVariables } from '../../../literal/util/assignVariables';
import { VariableMap } from '../../../literal/util/VariableMap';

export class OrderByStatement {
  constructor(
    private readonly statement: string,
    private readonly sort: Sort
  ) {}

  getSort(): Sort {
    return this.sort;
  }

  getStatement(variableMap: VariableMap): string {
    return assignVariables(this.statement, variableMap);
  }
}
