import { RelationshipType } from '../../../../domain/relationship/RelationshipType';
import { Direction } from '../../../../domain/graph/Direction';
import { DirectionTerm } from '../../../../domain/graph/pattern/formula/DirectionTerm';
import { RelationshipTypeTerm } from '../../../../domain/graph/pattern/formula/RelationshipTypeTerm';
import { PatternIndex } from '../../../../domain/graph/pattern/formula/PatternIndex';

export class GraphAssociation {
  private readonly rootKey: string;
  private readonly relationshipType: RelationshipType;
  private readonly direction: Direction;

  constructor(
    rootKey: string,
    relationshipType: RelationshipType,
    direction: Direction
  ) {
    this.rootKey = rootKey;
    this.relationshipType = relationshipType;
    this.direction = direction;
  }

  getRootKey(): string {
    return this.rootKey;
  }

  getRelationshipType(): RelationshipType {
    return this.relationshipType;
  }

  getDirection(): Direction {
    return this.direction;
  }

  getTerms(
    rootIndex: number
  ): [DirectionTerm, RelationshipTypeTerm, DirectionTerm] {
    return [
      new DirectionTerm(
        this.direction === '<-' ? '<-' : '-',
        new PatternIndex(++rootIndex)
      ),
      new RelationshipTypeTerm(
        ':' + this.relationshipType.toString(),
        new PatternIndex(++rootIndex)
      ),
      new DirectionTerm(
        this.direction === '->' ? '->' : '-',
        new PatternIndex(++rootIndex)
      ),
    ];
  }
}
