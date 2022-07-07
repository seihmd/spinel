import { ParameterLiteral } from '../parameter/ParameterLiteral';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';

export class RelationshipLiteral {
  private readonly variableName: string;
  private readonly relationshipType: RelationshipType | null;
  private readonly parameterLiteral: ParameterLiteral | null;

  constructor(
    variableName: string,
    relationshipType: RelationshipType | null,
    parameterLiteral: ParameterLiteral | null = null
  ) {
    this.variableName = variableName;
    this.relationshipType = relationshipType;
    this.parameterLiteral = parameterLiteral;
  }

  get(): string {
    return `[${
      this.variableName
    }${this.createType()}${this.createParameter()}]`;
  }

  private createType(): string {
    if (this.relationshipType === null) {
      return '';
    }

    return ':' + this.relationshipType.toString();
  }

  private createParameter(): string {
    if (this.parameterLiteral === null) {
      return '';
    }
    return this.parameterLiteral.get();
  }
}
