import { Path } from '../path/Path';
import { PathStep } from '../path/PathStep';
import { NodeLabelElement } from '../element/NodeLabelElement';
import { RelationshipTypeElement } from '../element/RelationshipTypeElement';
import { DirectionElement } from '../element/DirectionElement';
import { GraphMetadata } from '../../metadata/schema/graph/GraphMetadata';
import { NodeLabelTerm } from '../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../domain/graph/pattern/term/RelationshipTypeTerm';
import { RelationshipKeyTerm } from '../../domain/graph/pattern/term/RelationshipKeyTerm';
import { NodeKeyTerm } from '../../domain/graph/pattern/term/NodeKeyTerm';
import { BranchIndexes } from './BranchIndexes';
import { ElementContext } from '../element/ElementContext';
import { toPlain } from '../../util/toPlain';
import { NodeInstanceElement } from '../element/NodeInstanceElement';
import { RelationshipInstanceElement } from '../element/RelationshipInstanceElement';
import { toInstance } from '../../util/toInstance';

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
