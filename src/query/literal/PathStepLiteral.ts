import { PathStep } from '../path/PathStep';
import { RelationshipLiteral } from './RelationshipLiteral';
import { ParameterLiteral } from './ParameterLiteral';
import { GraphParameter } from '../parameter/GraphParameter';
import { NodeLiteral } from './NodeLiteral';
import { Direction } from '../../domain/graph/Direction';

export class PathStepLiteral {
  static new(pathStep: PathStep, graphParameter: GraphParameter) {
    const d1 = pathStep.getDirection1().getValue();
    const relationship = RelationshipLiteral.new(
      pathStep.getRelationship(),
      ParameterLiteral.new(pathStep.getRelationship(), graphParameter)
    );
    const d2 = pathStep.getDirection2().getValue();
    const node = NodeLiteral.new(
      pathStep.getNode(),
      ParameterLiteral.new(pathStep.getNode(), graphParameter)
    );

    return new PathStepLiteral(d1, relationship, d2, node);
  }

  private readonly direction1: Direction;
  private readonly relationshipLiteral: RelationshipLiteral;
  private readonly direction2: Direction;
  private readonly nodeLiteral: NodeLiteral;

  constructor(
    d1: Direction,
    relationshipLiteral: RelationshipLiteral,
    d2: Direction,
    nodeLiteral: NodeLiteral
  ) {
    this.direction1 = d1;
    this.relationshipLiteral = relationshipLiteral;
    this.direction2 = d2;
    this.nodeLiteral = nodeLiteral;
  }

  get(): string {
    return `${this.direction1}${this.relationshipLiteral.get()}${
      this.direction2
    }${this.nodeLiteral.get()}`;
  }
}
