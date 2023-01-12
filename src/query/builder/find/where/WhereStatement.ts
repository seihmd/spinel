import { assignVariables } from '../../../literal/util/assignVariables';
import { VariableMap } from '../../../literal/util/VariableMap';
import { translateStatement } from '../statement/translateStatement';
import { VariableSyntaxTranslator } from '../statement/VariableSyntaxTranslator';

export class WhereStatement {
  constructor(private statement: string) {}

  assign(variableMap: VariableMap): string {
    return assignVariables(this.statement, variableMap);
  }

  translate(variableSyntaxTranslator: VariableSyntaxTranslator): string {
    return translateStatement(this.statement, variableSyntaxTranslator);
  }
}
