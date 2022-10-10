export class DropConstraintClause {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  get(): string {
    return `DROP CONSTRAINT ${this.name}`;
  }
}
