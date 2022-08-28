import { WhereLiteral } from '../literal/WhereLiteral';

export class WhereClause {
  private readonly literal: WhereLiteral;

  constructor(literal: WhereLiteral) {
    this.literal = literal;
  }

  get(): string {
    return `WHERE ${this.literal.get()}`;
  }
}
