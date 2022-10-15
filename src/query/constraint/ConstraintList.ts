import { ConstraintData } from './ConstraintData';
import { ConstraintInterface } from './ConstraintInterface';

export class ConstraintList {
  private readonly constraintMap: Map<string, ConstraintInterface> = new Map();

  constructor(constraints: ConstraintInterface[]) {
    this.constraintMap = new Map(
      constraints.map((constraint) => [constraint.getName(), constraint])
    );
  }

  diff(
    constraintDataList: Pick<ConstraintData, 'name'>[]
  ): [ConstraintInterface[], string[]] {
    const toCreates: ConstraintInterface[] = [];
    const toDrops: string[] = [];

    const dataNames = constraintDataList.map((data) => data.name);

    dataNames.forEach((name) => {
      if (this.constraintMap.has(name)) {
        return;
      }

      toDrops.push(name);
    });

    [...this.constraintMap.entries()].forEach(([name, constraint]) => {
      if (dataNames.includes(name)) {
        return;
      }

      toCreates.push(constraint);
    });

    return [toCreates, toDrops];
  }
}
