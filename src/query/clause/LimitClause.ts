import { PositiveInt } from '../../domain/type/PositiveInt';

export class LimitClause {
  constructor(private readonly limit: PositiveInt) {}

  get(): string {
    return `LIMIT ${this.limit.get()}`;
  }
}
