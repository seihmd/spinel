import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { ElementContext } from '../../element/ElementContext';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { BranchEndTerm } from '../../../domain/graph/pattern/term/BranchEndTerm';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { DeleteClause } from '../../clause/DeleteClause';

export class DeleteNodeQuery {
  private readonly instance: InstanceType<ClassConstructor<object>>;
  private readonly nodeEntityMetadata: NodeEntityMetadata;
  private readonly detach: boolean;

  constructor(
    instance: InstanceType<ClassConstructor<object>>,
    nodeEntityMetadata: NodeEntityMetadata,
    detach: boolean
  ) {
    this.instance = instance;
    this.nodeEntityMetadata = nodeEntityMetadata;
    this.detach = detach;
  }

  public get(): string {
    const nodeInstanceElement = new NodeInstanceElement(
      this.instance,
      this.nodeEntityMetadata,
      new ElementContext(new BranchIndexes([]), 0, false),
      new BranchEndTerm('*')
    );

    const nodeLiteral = NodeLiteral.new(
      nodeInstanceElement,
      nodeInstanceElement.getPrimaries()
    );

    const matchNodeClause = new MatchNodeClause(nodeLiteral);
    const deleteClause = new DeleteClause(
      nodeLiteral.getVariableName(),
      this.detach
    );

    return `${matchNodeClause.get()} ${deleteClause.get()}`;
  }
}
