import { IndexInterface } from '../../../domain/index/IndexInterface';
import { CreateIndexClause } from '../../clause/index/CreateIndexClause';
import { AbstractStatement } from '../AbstractStatement';

export class CreateIndexStatement extends AbstractStatement {
  constructor(private readonly index: IndexInterface) {
    super();
  }

  protected build(): string {
    return new CreateIndexClause(this.index).get();
  }
}
