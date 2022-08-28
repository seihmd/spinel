import { Path } from '../path/Path';
import { AnyNodeElement } from '../element/Element';
import { PathStep } from '../path/PathStep';
import { NodeElement } from '../element/NodeElement';
import { NodeLabelElement } from '../element/NodeLabelElement';
import { RelationshipElement } from '../element/RelationshipElement';
import { RelationshipTypeElement } from '../element/RelationshipTypeElement';
import { DirectionElement } from '../element/DirectionElement';
import { GraphMetadata } from '../../metadata/schema/graph/GraphMetadata';
import { NodeLabelTerm } from '../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../domain/graph/pattern/term/RelationshipTypeTerm';
import { RelationshipKeyTerm } from '../../domain/graph/pattern/term/RelationshipKeyTerm';
import { NodeKeyTerm } from '../../domain/graph/pattern/term/NodeKeyTerm';
import { BranchIndexes } from './BranchIndexes';
import { ElementContext } from '../element/ElementContext';

export class GraphMaterial {
  static new(graphMetadata: GraphMetadata): GraphMaterial {
    const elements = graphMetadata
      .getFormula()
      .get()
      .map((term, i) => {
        if (term instanceof NodeKeyTerm) {
          return new NodeElement(
            term,
            graphMetadata.getGraphNodeMetadata(term.getValue()),
            new ElementContext(new BranchIndexes([]), i, false)
          );
        }
        if (term instanceof NodeLabelTerm) {
          return new NodeLabelElement(
            term,
            new ElementContext(new BranchIndexes([]), i, false)
          );
        }
        if (term instanceof RelationshipKeyTerm) {
          return new RelationshipElement(
            term,
            graphMetadata.getGraphRelationshipMetadata(term.getValue()),
            new ElementContext(new BranchIndexes([]), i, false)
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
    return new GraphMaterial(Path.new(elements));
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

  getNodeElement(key: string, branchIndexes: BranchIndexes): AnyNodeElement {
    const nodeElement = this.path.findNodeElement(key, branchIndexes);
    if (nodeElement) {
      return nodeElement.withContext(
        new ElementContext(branchIndexes, nodeElement.getIndex(), false)
      );
    }

    throw new Error(`Node element with key "${key}" not found`);
  }
}
