import { EntityParameterType, EntityParameterValueType } from './ParameterType';

export class EntityParameter {
  private readonly value: EntityParameterType | EntityParameterValueType;

  constructor(value: EntityParameterType | EntityParameterValueType) {
    this.value = value;
  }

  get(): EntityParameterType | EntityParameterValueType {
    return this.value;
  }
}
