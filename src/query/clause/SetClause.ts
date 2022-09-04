import { MatchClauseInterface } from './MatchClauseInterface';
import { Parameter } from '../parameter/Parameter';

export class SetClause implements MatchClauseInterface {
  private readonly variableName: string;
  private readonly parameter: Parameter;

  constructor(variableName: string, parameter: Parameter) {
    this.variableName = variableName;
    this.parameter = parameter;
  }

  get(): string {
    return `SET ${this.variableName}=${this.parameter.get$name()}`;
  }
}
