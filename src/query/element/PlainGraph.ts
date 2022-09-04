import { Term } from '../../domain/graph/pattern/term/Term';
import { toPlain } from '../../util/toPlain';
import { PlainEntity } from './PlainEntity';

type ValueType = Record<string, unknown>;

export class PlainGraph {
  static withInstance(instance: object): PlainGraph {
    return new PlainGraph(toPlain(instance));
  }

  private readonly value: ValueType;

  constructor(value: ValueType) {
    this.value = value;
  }

  get(): ValueType {
    return this.value;
  }

  getEntity(key: string): PlainEntity {
    const plainEntityValue = this.value[key];
    if (plainEntityValue === undefined) {
      throw new Error(`Key "${key}" is not found`);
    }

    return new PlainEntity(plainEntityValue as ValueType);
  }

  getEntities(key: string): PlainEntity[] {
    const plainEntityValues = this.value[key];
    if (plainEntityValues === undefined) {
      throw new Error(`Key "${key}" is not found`);
    }

    if (!Array.isArray(plainEntityValues)) {
      throw new Error(
        `Key "${key}" of instance is expected to be array, but ${typeof plainEntityValues}`
      );
    }

    return plainEntityValues.map(
      (plainEntityValue) => new PlainEntity(plainEntityValue as ValueType)
    );
  }

  getBranches(key: string): PlainGraph[] {
    const plainBranchValues = this.value[key] ?? [];
    if (!Array.isArray(plainBranchValues)) {
      throw new Error(
        `Key "${key}" of instance is expected to be array, but ${typeof plainBranchValues}`
      );
    }

    return plainBranchValues.map(
      (plainBranch) => new PlainGraph(plainBranch as ValueType)
    );
  }
}
