import { translateStatement } from '../statement/translateStatement';
import { VariableSyntaxTranslator } from '../statement/VariableSyntaxTranslator';

export class WhereStatement {
  constructor(private statement: string) {}

  translate(variableSyntaxTranslator: VariableSyntaxTranslator): string {
    return translateStatement(this.statement, variableSyntaxTranslator);
  }
}
