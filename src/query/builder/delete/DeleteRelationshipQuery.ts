import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { ElementContext } from '../../element/ElementContext';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { DeleteClause } from '../../clause/DeleteClause';
import { RelationshipEntityMetadata } from '../../../metadata/schema/entity/RelationshipEntityMetadata';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipLiteral } from '../../literal/RelationshipLiteral';
import { MatchRelationshipClause } from '../../clause/MatchRelationshipClause';

export class DeleteRelationshipQuery {
  private readonly instance: InstanceType<ClassConstructor<object>>;
  private readonly relationshipEntityMetadata: RelationshipEntityMetadata;

  constructor(
    instance: InstanceType<ClassConstructor<object>>,
    relationshipEntityMetadata: RelationshipEntityMetadata
  ) {
    this.instance = instance;
    this.relationshipEntityMetadata = relationshipEntityMetadata;
  }

  public get(): string {
    const relationshipInstanceElement = new RelationshipInstanceElement(
      this.instance,
      this.relationshipEntityMetadata,
      new ElementContext(new BranchIndexes([]), 0, false),
      new RelationshipKeyTerm('r')
    );

    const relationshipLiteral = RelationshipLiteral.new(
      relationshipInstanceElement,
      relationshipInstanceElement.getPrimaries()
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
