import { NodeLiteral } from '../literal/NodeLiteral';
import { MatchClauseInterface } from './MatchClauseInterface';

export class MatchNodeClause implements MatchClauseInterface {
  private literal: NodeLiteral;

  constructor(literal: NodeLiteral) {
    this.literal = literal;
  }

  get(): string {
    return `MATCH ${this.literal.get()}`;
  }
}
