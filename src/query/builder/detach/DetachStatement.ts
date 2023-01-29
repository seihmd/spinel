import { Direction, LEFT, NONE, RIGHT } from '../../../domain/graph/Direction';
import { DeleteClause } from '../../clause/DeleteClause';
import { MatchPathClause } from '../../clause/MatchPathClause';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { PathLiteral } from '../../literal/PathLiteral';
import { PathStepLiteral } from '../../literal/PathStepLiteral';
import { RelationshipLiteral } from '../../literal/RelationshipLiteral';
import { AbstractStatement } from '../AbstractStatement';

export class DetachStatement extends AbstractStatement {
  constructor(
    private readonly nodeElement1: NodeInstanceElement | NodeLabelElement,
    private readonly nodeElement2:
      | NodeInstanceElement
      | NodeLabelElement
      | null,
    private readonly relationshipElement: RelationshipTypeElement | null,
    private readonly direction: Direction
  ) {
    super();
  }

  protected build(): string {
    const matchPathClause = new MatchPathClause(
      new PathLiteral(
        NodeLiteral.new(
          this.nodeElement1,
          this.nodeElement1 instanceof NodeInstanceElement
            ? this.nodeElement1.getPrimaries()
            : null
        ),
        [
          new PathStepLiteral(
            this.direction === LEFT ? LEFT : NONE,
            this.relationshipElement
              ? RelationshipLiteral.new(this.relationshipElement)
              : new RelationshipLiteral('r', null),
            this.direction === RIGHT ? RIGHT : NONE,
            this.nodeElement2
              ? NodeLiteral.new(
                  this.nodeElement2,
                  this.nodeElement2 instanceof NodeInstanceElement
                    ? this.nodeElement2.getPrimaries()
                    : null
                )
              : NodeLiteral.blank()
          ),
        ]
      )
    );

    const deleteClause = new DeleteClause(
      this.relationshipElement
        ? this.relationshipElement.getVariableName()
        : 'r',
      false
    );

    return `${matchPathClause.get()} ${deleteClause.get()}`;
  }
}
