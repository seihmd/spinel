import { NodeLabel } from '../../domain/node/NodeLabel';
import { ParameterLiteral } from './ParameterLiteral';
import { AnyNodeElement } from '../element/Element';

export class NodeLiteral {
  static new(
    nodeElement: AnyNodeElement,
    parameterLiteral: ParameterLiteral | null
  ): NodeLiteral {
    return new NodeLiteral(
      nodeElement.getVariableName(),
      nodeElement.getLabel(),
      parameterLiteral
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
    this.variableName = variableName;
    this.nodeLabel = nodeLabel;
    this.parameterLiteral = parameterLiteral;
  }

  get(): string {
    return `(${
      this.variableName
    }${this.createLabel()}${this.createParameter()})`;
  }

  private createLabel(): string {
    if (this.nodeLabel === null) {
      return '';
    }

    return ':' + this.nodeLabel.toString();
  }

  private createParameter(): string {
    if (this.parameterLiteral === null) {
      return '';
    }
    return this.parameterLiteral.get();
  }
}
