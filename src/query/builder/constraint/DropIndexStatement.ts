import { DropIndexClause } from '../../clause/index/DropIndexClause';
import { AbstractStatement } from '../AbstractStatement';

export class DropIndexStatement extends AbstractStatement {
  constructor(private readonly indexName: string) {
    super();
  }

  protected build(): string {
    return new DropIndexClause(this.indexName).get();
  }
}
