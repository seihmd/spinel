import { BranchIndexes } from '../../../meterial/BranchIndexes';
import { WhereStatement } from './WhereStatement';

export class BranchFilter {
  private readonly whereStatement: WhereStatement;

  constructor(private readonly branch: string, statement: string) {
    this.whereStatement = new WhereStatement(statement);
  }

  matches(branchIndexes: BranchIndexes): boolean {
    return this.branch === branchIndexes.getGraphKeys().join('.');
  }

  getWhereStatement(): WhereStatement {
    return this.whereStatement;
  }
}
