import { DropConstraintClause } from '../../clause/constraint/DropConstraintClause';
import { AbstractStatement } from '../AbstractStatement';

export class DropConstraintStatement extends AbstractStatement {
  constructor(private readonly constraintName: string) {
    super();
  }

  protected build(): string {
    return new DropConstraintClause(this.constraintName).get();
  }
}
