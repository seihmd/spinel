import { DeleteClause } from '../../clause/DeleteClause';
import { MatchRelationshipClause } from '../../clause/MatchRelationshipClause';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';
import { RelationshipLiteral } from '../../literal/RelationshipLiteral';
import { AbstractStatement } from '../AbstractStatement';

export class DeleteRelationshipStatement extends AbstractStatement {
  private readonly relationshipInstanceElement: RelationshipInstanceElement;

  constructor(relationshipInstanceElement: RelationshipInstanceElement) {
    super();
    this.relationshipInstanceElement = relationshipInstanceElement;
  }

  protected build(): string {
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
