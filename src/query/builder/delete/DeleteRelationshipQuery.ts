import { DeleteClause } from '../../clause/DeleteClause';
import { RelationshipLiteral } from '../../literal/RelationshipLiteral';
import { MatchRelationshipClause } from '../../clause/MatchRelationshipClause';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';

export class DeleteRelationshipQuery {
  private readonly relationshipInstanceElement: RelationshipInstanceElement;

  constructor(relationshipInstanceElement: RelationshipInstanceElement) {
    this.relationshipInstanceElement = relationshipInstanceElement;
  }

  public get(): string {
    const relationshipLiteral = RelationshipLiteral.new(
      this.relationshipInstanceElement,
      this.relationshipInstanceElement.getPrimaries()
    );

    const matchRelationshipClause = new MatchRelationshipClause(
      relationshipLiteral
    );
    const deleteClause = new DeleteClause(
      relationshipLiteral.getVariableName(),
      false
    );

    return `${matchRelationshipClause.get()} ${deleteClause.get()}`;
  }
}