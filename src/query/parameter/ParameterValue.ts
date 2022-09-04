export type ParameterType = unknown;

export class ParameterValue {
  private readonly value: ParameterType;

  constructor(value: ParameterType) {
    this.value = value;
  }

  get(): ParameterType {
    // TODO convert to parameter value
    return this.value;
  }
}
