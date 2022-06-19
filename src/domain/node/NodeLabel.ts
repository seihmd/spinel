import { AnyClassConstructor } from '../type/ClassConstructor';

export class NodeLabel {
  private readonly value: string;

  constructor(value: string | AnyClassConstructor) {
    if (typeof value === 'string') {
      if (value.length === 0) {
        throw new Error('Node Label must be at least 1 character');
      }

      this.value = value;
    } else {
      this.value = value.name;
    }
  }

  toString(): string {
    return this.value;
  }
}
