export abstract class AbstractStatement {
  protected statement: string | null = null;

  protected abstract build(): string;

  get(): string {
    if (this.statement !== null) {
      return this.statement;
    }

    this.statement = this.build();
    return this.statement;
  }

  as(): string {
    return '_';
  }
}
