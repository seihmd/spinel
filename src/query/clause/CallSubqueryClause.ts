export class CallSubqueryClause {
  private readonly subquery: string;
  private readonly inTransactions: boolean;

  constructor(subQuery: string, inTransactions: boolean) {
    this.subquery = subQuery;
    this.inTransactions = inTransactions;
  }

  get(): string {
    return `CALL {${this.subquery}}${
      this.inTransactions ? ' IN TRANSACTIONS' : ''
    }`;
  }
}
