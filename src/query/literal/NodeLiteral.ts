import { NodeLabel } from '../../domain/node/NodeLabel';
import { ParameterLiteral } from './ParameterLiteral';
import { AnyNodeElement } from '../element/Element';
import { EntityLiteralOption } from './EntityLiteralOption';
import { EntityLiteral } from './EntityLiteral';
import { EntityParameter } from '../parameter/EntityParameter';
import { NodeInstanceElement } from '../element/NodeInstanceElement';

export class NodeLiteral extends EntityLiteral {
  static new(
    nodeElement: AnyNodeElement | NodeInstanceElement,
    entityParameter: EntityParameter | null = null
  ): NodeLiteral {
    return new NodeLiteral(
      nodeElement.getVariableName(),
      nodeElement.getLabel(),
      entityParameter ? new ParameterLiteral(entityParameter) : null
    );
  }

  private readonly nodeLabel: NodeLabel | null;
  private readonly variableName: string;
  private readonly parameterLiteral: ParameterLiteral | null;

  constructor(
    variableName: string,
    nodeLabel: NodeLabel | null,
    parameterLiteral: ParameterLiteral | null
  ) {
    super();
    this.variableName = variableName;
    this.nodeLabel = nodeLabel;
    this.parameterLiteral = parameterLiteral;
  }

  get(partial: Partial<EntityLiteralOption> = {}): string {
    const option = this.getOption(partial);
    return `(${this.getVariableName(option)}${this.getLabel(
      option
    )}${this.getParameter(option)})`;
  }

  getVariableName(option: EntityLiteralOption | null = null): string {
    if (option !== null && !option.variable) {
      return '';
    }

    return this.variableName;
  }

  private getLabel(option: EntityLiteralOption): string {
    if (!option.labelType) {
      return '';
    }
    if (this.nodeLabel === null) {
      return '';
    }

    return ':' + this.nodeLabel.toString();
  }

  private getParameter(option: EntityLiteralOption): string {
    if (!option.parameter) {
      return '';
    }
    if (this.parameterLiteral === null) {
      return '';
    }
    return this.parameterLiteral.get();
  }
}
