import { ParameterLiteral } from '../parameter/ParameterLiteral';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { AnyRelationshipElement } from '../../element/Element';

export class RelationshipLiteral {
  static new(
    relationshipElement: AnyRelationshipElement,
    parameterLiteral: ParameterLiteral | null
  ): RelationshipLiteral {
    return new RelationshipLiteral(
      relationshipElement.getVariableName(),
      relationshipElement.getType(),
      parameterLiteral
    );
  }

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
