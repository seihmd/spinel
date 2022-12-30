import { OrderByLiteral } from '../../literal/OrderByLiteral';

export class OrderByClause {
  private readonly literals: OrderByLiteral[];

  constructor(literals: OrderByLiteral[]) {
    this.literals = literals;
  }

  get(): string {
    if (this.literals.length === 0) {
      return '';
    }
    return `ORDER BY ${this.literals
      .map((literal) => literal.get())
      .join(',')}`;
  }
}
