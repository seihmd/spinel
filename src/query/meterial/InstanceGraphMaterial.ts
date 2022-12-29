import { AssociationReferenceTerm } from '../../domain/graph/pattern/term/AssociationReferenceTerm';
import { NodeKeyTerm } from '../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from '../../domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from '../../domain/graph/pattern/term/RelationshipTypeTerm';
import { GraphMetadata } from '../../metadata/schema/graph/GraphMetadata';
import { toInstance } from '../../util/toInstance';
import { toPlain } from '../../util/toPlain';
import { DirectionElement } from '../element/DirectionElement';
import { ElementContext } from '../element/ElementContext';
import { NodeInstanceElement } from '../element/NodeInstanceElement';
import { NodeLabelElement } from '../element/NodeLabelElement';
import { RelationshipInstanceElement } from '../element/RelationshipInstanceElement';
import { RelationshipTypeElement } from '../element/RelationshipTypeElement';
import { Path } from '../path/Path';
import { PathStep } from '../path/PathStep';
import { BranchIndexes } from './BranchIndexes';

export class InstanceGraphMaterial {
  static new(
    instance: object,
    graphMetadata: GraphMetadata
  ): InstanceGraphMaterial {
    const plain = toPlain(instance);

    const elements = graphMetadata
      .getFormula()
      .get()
      .map((term, i) => {
        const plainEntity = plain[term.getKey() ?? ''];

        if (term instanceof NodeKeyTerm) {
          if (!plainEntity) {
            throw new Error();
          }
          const nodeMetadata = graphMetadata
            .getGraphNodeMetadata(term.getValue())
            .getEntityMetadata();
          return new NodeInstanceElement(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            toInstance(nodeMetadata.getCstr(), plainEntity),
            nodeMetadata,
            new ElementContext(new BranchIndexes([]), i, false),
            term
          );
        }
        if (term instanceof NodeLabelTerm) {
          return new NodeLabelElement(
            term,
            new ElementContext(new BranchIndexes([]), i, false)
          );
        }
        if (term instanceof AssociationReferenceTerm) {
          throw new Error('AssociationReferenceTerm found.');
        }
        if (term instanceof RelationshipKeyTerm) {
          if (!plainEntity) {
            throw new Error();
          }
          const relationshipMetadata = graphMetadata
            .getGraphRelationshipMetadata(term.getValue())
            .getEntityMetadata();
          return new RelationshipInstanceElement(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            toInstance(relationshipMetadata.getCstr(), plainEntity),
            relationshipMetadata,
            new ElementContext(new BranchIndexes([]), i, false),
            term
          );
        }
        if (term instanceof RelationshipTypeTerm) {
          return new RelationshipTypeElement(
            term,
            new ElementContext(new BranchIndexes([]), i, false)
          );
        }
        return new DirectionElement(term);
      });
    return new InstanceGraphMaterial(Path.new(elements));
  }

  private readonly path: Path;

  constructor(path: Path) {
    this.path = path;
  }

  getPath(): Path {
    return this.path;
  }

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }
}
