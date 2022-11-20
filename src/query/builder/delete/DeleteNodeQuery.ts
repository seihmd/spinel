import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { DeleteClause } from '../../clause/DeleteClause';

export class DeleteNodeQuery {
  private readonly nodeInstanceElement: NodeInstanceElement;
  private readonly detach: boolean;

  constructor(nodeInstanceElement: NodeInstanceElement, detach: boolean) {
    this.nodeInstanceElement = nodeInstanceElement;
    this.detach = detach;
  }

  public get(): string {
    const nodeLiteral = NodeLiteral.new(
      this.nodeInstanceElement,
      this.nodeInstanceElement.getPrimaries()
    );

    const matchNodeClause = new MatchNodeClause(nodeLiteral);
    const deleteClause = new DeleteClause(
      nodeLiteral.getVariableName(),
      this.detach
    );

    return `${matchNodeClause.get()} ${deleteClause.get()}`;
  }
}
