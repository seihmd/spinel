import { WhereStatement } from '../../clause/where/WhereStatement';

export class BranchFilter {
  private readonly whereStatement: WhereStatement;

  constructor(private readonly branch: string, statement: string) {
    this.whereStatement = new WhereStatement(statement);
  }

  matches(key: string): boolean {
    return this.branch === key;
  }

  getWhereStatement(): WhereStatement {
    return this.whereStatement;
  }
}
