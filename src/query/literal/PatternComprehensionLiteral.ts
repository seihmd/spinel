import { PathLiteral } from './PathLiteral';
import { WhereClause } from '../clause/WhereClause';

export class PatternComprehensionLiteral {
  private readonly pathLiteral: PathLiteral;
  private readonly filter: string;
  private readonly whereClause: WhereClause | null;

  constructor(
    graphLiteral: PathLiteral,
    whereClause: WhereClause | null,
    filter: string
  ) {
    this.whereClause = whereClause;
    this.pathLiteral = graphLiteral;
    this.filter = filter;
  }

  get(): string {
    return `[${this.pathLiteral.get()}${this.getWhereClause()}|${this.filter}]`;
  }

  private getWhereClause(): string {
    if (this.whereClause === null) {
      return '';
    }

    return ` ${this.whereClause.get()}`;
  }
}
