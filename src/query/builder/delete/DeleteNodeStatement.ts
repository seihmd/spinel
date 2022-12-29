import { DeleteClause } from '../../clause/DeleteClause';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { AbstractStatement } from '../AbstractStatement';

export class DeleteNodeStatement extends AbstractStatement {
  private readonly nodeInstanceElement: NodeInstanceElement;

  constructor(nodeInstanceElement: NodeInstanceElement) {
    super();
    this.nodeInstanceElement = nodeInstanceElement;
  }

  protected build(): string {
    const nodeLiteral = NodeLiteral.new(
      this.nodeInstanceElement,
      this.nodeInstanceElement.getPrimaries()
    );

    const matchNodeClause = new MatchNodeClause(nodeLiteral);
    const deleteClause = new DeleteClause(nodeLiteral.getVariableName(), false);

    return `${matchNodeClause.get()} ${deleteClause.get()}`;
  }
}
