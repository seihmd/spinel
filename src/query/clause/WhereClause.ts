export class WhereClause {
  constructor(private readonly statement: string) {}

  get(): string {
    return `WHERE ${this.statement}`;
  }
}
