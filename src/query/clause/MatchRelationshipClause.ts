import { RelationshipLiteral } from '../literal/RelationshipLiteral';
import { MatchClauseInterface } from './MatchClauseInterface';

export class MatchRelationshipClause implements MatchClauseInterface {
  private literal: RelationshipLiteral;

  constructor(literal: RelationshipLiteral) {
    this.literal = literal;
  }

  get(): string {
    return `MATCH ()-${this.literal.get()}-()`;
  }
}
