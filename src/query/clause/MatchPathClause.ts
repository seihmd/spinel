import { MatchClauseInterface } from './MatchClauseInterface';
import { PathLiteral } from '../literal/PathLiteral';

export class MatchPathClause implements MatchClauseInterface {
  private pathLiteral: PathLiteral;

  constructor(pathLiteral: PathLiteral) {
    this.pathLiteral = pathLiteral;
  }

  get(): string {
    return `MATCH ${this.pathLiteral.get()}`;
  }
}
