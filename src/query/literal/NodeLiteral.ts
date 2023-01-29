import { NodeLabel } from '../../domain/node/NodeLabel';
import { AnyNodeElement } from '../element/Element';
import { NodeInstanceElement } from '../element/NodeInstanceElement';
import { EntityParameter } from '../parameter/EntityParameter';
import { EntityLiteral } from './EntityLiteral';
import { EntityLiteralOption } from './EntityLiteralOption';
import { ParameterLiteral } from './ParameterLiteral';

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

  static blank(): NodeLiteral {
    return new NodeLiteral('', null, null);
  }

  constructor(
    private readonly variableName: string,
    private readonly nodeLabel: NodeLabel | null,
    private readonly parameterLiteral: ParameterLiteral | null
  ) {
    super();
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
