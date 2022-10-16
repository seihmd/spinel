export class DropIndexClause {
  private readonly indexName: string;

  constructor(indexName: string) {
    this.indexName = indexName;
  }

  get(): string {
    return `DROP INDEX ${this.indexName}`;
  }
}
