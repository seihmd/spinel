import { ParameterLiteral } from './ParameterLiteral';
import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { AnyRelationshipElement } from '../element/Element';
import { EntityLiteralOption } from './EntityLiteralOption';
import { EntityLiteral } from './EntityLiteral';
import { EntityParameter } from '../parameter/EntityParameter';
import { RelationshipInstanceElement } from '../element/RelationshipInstanceElement';

export class RelationshipLiteral extends EntityLiteral {
  static new(
    relationshipElement: AnyRelationshipElement | RelationshipInstanceElement,
    entityParameter: EntityParameter | null = null
  ): RelationshipLiteral {
    return new RelationshipLiteral(
      relationshipElement.getVariableName(),
      relationshipElement.getType(),
      entityParameter ? new ParameterLiteral(entityParameter) : null
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
    super();
    this.variableName = variableName;
    this.relationshipType = relationshipType;
    this.parameterLiteral = parameterLiteral;
  }

  get(partial: Partial<EntityLiteralOption> = {}): string {
    const option = this.getOption(partial);
    return `[${option.variable ? this.getVariableName() : ''}${this.createType(
      option
    )}${this.createParameter(option)}]`;
  }

  getVariableName(): string {
    return this.variableName;
  }

  private createType(option: EntityLiteralOption): string {
    if (!option.labelType) {
      return '';
    }
    if (this.relationshipType === null) {
      return '';
    }

    return ':' + this.relationshipType.toString();
  }

  private createParameter(option: EntityLiteralOption): string {
    if (!option.parameter) {
      return '';
    }
    if (this.parameterLiteral === null) {
      return '';
    }
    return this.parameterLiteral.get();
  }
}
