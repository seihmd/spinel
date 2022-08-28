import { MapLiteral } from '../literal/MapLiteral';

export class ReturnClause {
  private returns: (string | MapLiteral)[];

  constructor(returns: (string | MapLiteral)[]) {
    this.returns = returns;
  }

  get(): string {
    return `RETURN ${this.create()}`;
  }

  private create(): string {
    return this.returns
      .map((v) => {
        if (typeof v === 'string') {
          return v;
        }
        return v.get();
      })
      .join(',');
  }
}
