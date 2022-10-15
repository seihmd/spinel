import { NodeLabel } from '../../domain/node/NodeLabel';
import { ConstraintInterface } from './ConstraintInterface';

export class CreateConstraintClause {
  private readonly constraint: ConstraintInterface;

  constructor(constraint: ConstraintInterface) {
    this.constraint = constraint;
  }

  get(): string {
    return (
      `CREATE CONSTRAINT ${this.constraint.getName()} ` +
      `IF NOT EXISTS FOR ${this.getPattern()} ` +
      `REQUIRE ${this.getProperties()} IS ${this.constraint.getRequire()}`
    );
  }

  private getPattern(): string {
    if (this.constraint.getLabelOrType() instanceof NodeLabel) {
      return `(e:${this.constraint.getLabelOrType().toString()})`;
    }
    return `()-[e:${this.constraint.getLabelOrType().toString()}]-()`;
  }

  private getProperties(): string {
    if (this.constraint.getProperties().length === 1) {
      return `e.${this.constraint.getProperties()[0]}`;
    }

    return `(${this.constraint
      .getProperties()
      .map((p) => `e.${p}`)
      .join(', ')})`;
  }
}
