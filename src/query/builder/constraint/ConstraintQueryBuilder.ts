import { ConstraintInterface } from '../../../domain/constraint/ConstraintInterface';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { CreateConstraintQuery } from './CreateConstraintQuery';
import { CreateConstraintStatement } from './CreateConstraintStatement';
import { DropConstraintQuery } from './DropConstraintQuery';
import { DropConstraintStatement } from './DropConstraintStatement';

export class ConstraintQueryBuilder {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly constraints: ConstraintInterface[],
    private readonly existingConstraintNames: string[]
  ) {}

  buildCreateQueries(): CreateConstraintQuery[] {
    return this.constraints
      .filter(
        (constraint) =>
          !this.existingConstraintNames.includes(constraint.getName())
      )
      .map(
        (constraint) =>
          new CreateConstraintQuery(
            this.sessionProvider,
            new CreateConstraintStatement(constraint)
          )
      );
  }

  buildDropQueries(): DropConstraintQuery[] {
    const constraintNames = this.constraints.map((index) => index.getName());
    return this.existingConstraintNames
      .filter((constraintName) => !constraintNames.includes(constraintName))
      .map(
        (constraintName) =>
          new DropConstraintQuery(
            this.sessionProvider,
            new DropConstraintStatement(constraintName)
          )
      );
  }
}
