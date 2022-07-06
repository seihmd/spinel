import { EntityParameterType } from './ParameterType';

export class EntityParameter {
  private readonly value: EntityParameterType;

  constructor(value: EntityParameterType) {
    this.value = value;
  }

  get(): EntityParameterType {
    return this.value;
  }
}
