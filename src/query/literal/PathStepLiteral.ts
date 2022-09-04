import { PathStep } from '../path/PathStep';
import { RelationshipLiteral } from './RelationshipLiteral';
import { NodeLiteral } from './NodeLiteral';
import { Direction } from '../../domain/graph/Direction';
import { EntityLiteralOption } from './EntityLiteralOption';

export class PathStepLiteral {
  static new(pathStep: PathStep) {
    const d1 = pathStep.getDirection1().getValue();
    const relationship = RelationshipLiteral.new(pathStep.getRelationship());
    const d2 = pathStep.getDirection2().getValue();
    const node = NodeLiteral.new(pathStep.getNode());

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

  get(
    relationshipOption: Partial<EntityLiteralOption> = {},
    nodeOption: Partial<EntityLiteralOption> = {}
  ): string {
    return `${this.direction1}${this.relationshipLiteral.get(
      relationshipOption
    )}${this.direction2}${this.nodeLiteral.get(nodeOption)}`;
  }
}
