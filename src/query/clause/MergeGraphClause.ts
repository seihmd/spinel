import { MatchClauseInterface } from './MatchClauseInterface';
import { PathLiteral } from '../literal/PathLiteral';
import { Path } from '../path/Path';
import { NodeLiteral } from '../literal/NodeLiteral';
import { PathStepLiteral } from '../literal/PathStepLiteral';
import { RelationshipLiteral } from '../literal/RelationshipLiteral';
import { AnyNodeElement, AnyRelationshipElement } from '../element/Element';
import { NodeInstanceElement } from '../element/NodeInstanceElement';
import { RelationshipInstanceElement } from '../element/RelationshipInstanceElement';
import { ParameterLiteral } from '../literal/ParameterLiteral';

export class MergeGraphClause implements MatchClauseInterface {
  private readonly path: Path;

  constructor(path: Path) {
    this.path = path;
  }

  get(): string {
    const pathLiteral = new PathLiteral(
      this.createNodeLiteral(this.path.getRoot()),
      this.path.getSteps().map((pathStep) => {
        return new PathStepLiteral(
          pathStep.getDirection1().getValue(),
          this.createRelationshipLiteral(pathStep.getRelationship()),
          pathStep.getDirection2().getValue(),
          this.createNodeLiteral(pathStep.getNode())
        );
      })
    );
    return `MERGE ${pathLiteral.get()}`;
  }

  private createNodeLiteral(nodeElement: AnyNodeElement): NodeLiteral {
    if (nodeElement instanceof NodeInstanceElement) {
      return new NodeLiteral(nodeElement.getVariableName(), null, null);
    }

    return NodeLiteral.new(nodeElement);
  }

  private createRelationshipLiteral(
    relationshipElement: AnyRelationshipElement
  ): RelationshipLiteral {
    if (relationshipElement instanceof RelationshipInstanceElement) {
      return new RelationshipLiteral(
        relationshipElement.getVariableName(),
        relationshipElement.getType(),
        new ParameterLiteral(relationshipElement.getPrimaries())
      );
    }

    return RelationshipLiteral.new(relationshipElement);
  }
}
