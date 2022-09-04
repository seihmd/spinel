import { NodeLiteral } from '../literal/NodeLiteral';
import { MatchClauseInterface } from './MatchClauseInterface';
import { RelationshipLiteral } from '../literal/RelationshipLiteral';

export class MergeEntityClause implements MatchClauseInterface {
  private literal: NodeLiteral | RelationshipLiteral;

  constructor(literal: NodeLiteral | RelationshipLiteral) {
    this.literal = literal;
  }

  get(): string {
    return `MERGE ${this.literal.get()}`;
  }
}
