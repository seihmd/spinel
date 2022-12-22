import { ConstraintInterface } from '../../../domain/constraint/ConstraintInterface';
import { CreateConstraintClause } from '../../clause/constraint/CreateConstraintClause';
import { AbstractStatement } from '../AbstractStatement';

export class CreateConstraintStatement extends AbstractStatement {
  constructor(private readonly constraint: ConstraintInterface) {
    super();
  }

  protected build(): string {
    return new CreateConstraintClause(this.constraint).get();
  }
}
