export class WhereQuery {
  private readonly key: string | null;
  private readonly query: string;

  constructor(key: string | null, query: string) {
    this.key = key;
    this.query = query;
  }

  matchesKey(key: string | null): boolean {
    return this.key === key;
  }

  getQuery(): string {
    return this.query;
  }
}
