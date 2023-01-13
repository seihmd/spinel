import { Sort } from '../../../literal/OrderByLiteral';
import { translateStatement } from '../statement/translateStatement';
import { VariableSyntaxTranslator } from '../statement/VariableSyntaxTranslator';

export class OrderByStatement {
  constructor(
    private readonly statement: string,
    private readonly sort: Sort
  ) {}

  getSort(): Sort {
    return this.sort;
  }

  translate(variableSyntaxTranslator: VariableSyntaxTranslator): string {
    return translateStatement(this.statement, variableSyntaxTranslator);
  }
}
