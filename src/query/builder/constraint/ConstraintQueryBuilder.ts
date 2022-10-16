import { ConstraintInterface } from '../../../domain/constraint/ConstraintInterface';
import { DropConstraintClause } from '../../clause/constraint/DropConstraintClause';
import { CreateConstraintClause } from '../../clause/constraint/CreateConstraintClause';

export class ConstraintQueryBuilder {
  private constraints: ConstraintInterface[];
  private existingConstraintNames: string[];

  constructor(
    indexes: ConstraintInterface[],
    existingConstraintNames: string[]
  ) {
    this.constraints = indexes;
    this.existingConstraintNames = existingConstraintNames;
  }

  getCreateClauses(): CreateConstraintClause[] {
    return this.constraints
      .filter(
        (index) => !this.existingConstraintNames.includes(index.getName())
      )
      .map((index) => new CreateConstraintClause(index));
  }

  getDropClauses(): DropConstraintClause[] {
    const indexNames = this.constraints.map((index) => index.getName());
    return this.existingConstraintNames
      .filter((indexName) => !indexNames.includes(indexName))
      .map((indexName) => new DropConstraintClause(indexName));
  }
}
