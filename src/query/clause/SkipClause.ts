import { PositiveInt } from '../../domain/type/PositiveInt';

export class SkipClause {
  constructor(private readonly count: PositiveInt) {}

  get(): string {
    return `SKIP ${this.count.get()}`;
  }
}
