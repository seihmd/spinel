import { GraphParameterKey } from './GraphParameterKey';
import { EntityParameterType } from './ParameterType';

export class GraphParameterEntry {
  private readonly key: GraphParameterKey;
  private readonly value: EntityParameterType;

  constructor(key: GraphParameterKey, value: EntityParameterType) {
    this.key = key;
    this.value = value;
  }

  getRoot(): string | null {
    return this.key.getRoot();
  }

  getLeave(): string {
    return this.key.getExceptRoot();
  }

  getValue(): EntityParameterType {
    return this.value;
  }

  getKey(): string {
    return this.key.asPlain();
  }

  asPlain(): { [key: string]: unknown } {
    const keys = [...this.key.getValues()].reverse();
    return keys.slice(1).reduce(
      (prev: { [key: string]: unknown }, value) => {
        return { [value]: Object.assign({}, prev) };
      },
      {
        [keys[0]]: this.value,
      }
    );
  }
}