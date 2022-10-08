import { ParameterType, ParameterValue } from './ParameterValue';
import { ParameterName } from './ParameterName';

export class Parameter {
  static new(name: string, value: ParameterType): Parameter {
    return new Parameter(new ParameterName(name), new ParameterValue(value));
  }

  private readonly name: ParameterName;
  private readonly value: ParameterValue;

  constructor(name: ParameterName, value: ParameterValue) {
    this.name = name;
    this.value = value;
  }

  getName(): string {
    return this.name.get();
  }

  getPropertyName(): string {
    return this.name.getPropertyName();
  }

  get$name(): string {
    return '$' + this.name.get();
  }

  getValue(): unknown {
    return this.value.get();
  }

  toPlain(): unknown {
    return this.name
      .getSplit()
      .reverse()
      .reduce((prev: unknown, name: string) => {
        prev = { [name]: prev };
        return prev;
      }, this.getValue());
  }
}
