import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { DeleteClause } from '../../clause/DeleteClause';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { MatchPathClause } from '../../clause/MatchPathClause';
import { PathLiteral } from '../../literal/PathLiteral';
import { Path } from '../../path/Path';
import { Direction, LEFT, NONE, RIGHT } from '../../../domain/graph/Direction';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';
import { DirectionElement } from '../../element/DirectionElement';

export class DetachQuery {
  private readonly nodeElement1: NodeInstanceElement | NodeLabelElement;
  private readonly relationshipElement: RelationshipTypeElement;
  private readonly nodeElement2: NodeInstanceElement | NodeLabelElement;
  private readonly direction: Direction;

  constructor(
    nodeElement1: NodeInstanceElement | NodeLabelElement,
    relationshipElement: RelationshipTypeElement,
    nodeElement2: NodeInstanceElement | NodeLabelElement,
    direction: Direction
  ) {
    this.nodeElement1 = nodeElement1;
    this.relationshipElement = relationshipElement;
    this.nodeElement2 = nodeElement2;
    this.direction = direction;
  }

  public get(): string {
    const matchPathClause = new MatchPathClause(
      PathLiteral.new(
        Path.new([
          this.nodeElement1,
          new DirectionElement(
            new DirectionTerm(this.direction === LEFT ? LEFT : NONE)
          ),
          this.relationshipElement,
          new DirectionElement(
            new DirectionTerm(this.direction === RIGHT ? RIGHT : NONE)
          ),
          this.nodeElement2,
        ])
      )
    );
    const deleteClause = new DeleteClause(
      this.relationshipElement.getVariableName(),
      false
    );

    return `${matchPathClause.get()} ${deleteClause.get()}`;
  }
}
