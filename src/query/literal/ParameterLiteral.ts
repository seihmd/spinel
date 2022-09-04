import { EntityParameter } from '../parameter/EntityParameter';

export class ParameterLiteral {
  private readonly entityParameter: EntityParameter;

  constructor(entityParameter: EntityParameter) {
    this.entityParameter = entityParameter;
  }

  get(): string {
    const parameters = this.entityParameter.toParameter();
    if (Object.keys(parameters).length === 0) {
      return '';
    }
    return JSON.stringify(parameters).replaceAll('"', '');
  }
}
