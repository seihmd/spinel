import { BranchMaterial } from './BranchMaterial';
import { GraphBranchMetadata } from '../../metadata/schema/graph/GraphBranchMetadata';
import { Path } from '../path/Path';
import { NodeElement } from '../element/NodeElement';
import { DirectionElement } from '../element/DirectionElement';
import { NodeLabelElement } from '../element/NodeLabelElement';
import { RelationshipTypeElement } from '../element/RelationshipTypeElement';
import { PathStep } from '../path/PathStep';

import { AnyNodeElement } from '../element/Element';
import { NodeEntityMetadata } from '../../metadata/schema/entity/NodeEntityMetadata';
import { DirectionTerm } from '../../domain/graph/pattern/term/DirectionTerm';
import { NodeLabelTerm } from '../../domain/graph/pattern/term/NodeLabelTerm';
import { GraphMaterial } from './GraphMaterial';
import { BranchIndexes } from './BranchIndexes';
import { BranchEndTerm } from '../../domain/graph/pattern/term/BranchEndTerm';
import { ElementContext } from '../element/ElementContext';

export class BranchNodeMaterial implements BranchMaterial {
  private readonly path: Path;
  private readonly graphBranchMetadata: GraphBranchMetadata;

  static new(
    graphBranchMetadata: GraphBranchMetadata,
    branchEndMetadata: NodeEntityMetadata,
    stemGraphMaterial: GraphMaterial | BranchMaterial,
    branchIndexes: BranchIndexes
  ) {
    const rootElement = stemGraphMaterial.getNodeElement(
      graphBranchMetadata.getRootKey(),
      branchIndexes.reduce()
    );

    let index = 0;
    const intermediates = graphBranchMetadata
      .getIntermediateTerms()
      .map((term) => {
        index++;
        if (term instanceof DirectionTerm) {
          return new DirectionElement(term);
        }
        if (term instanceof NodeLabelTerm) {
          return new NodeLabelElement(
            term,
            new ElementContext(branchIndexes, index, false)
          );
        }
        return new RelationshipTypeElement(
          term,
          new ElementContext(branchIndexes, index, false)
        );
      });

    const terminalElement = new NodeElement(
      new BranchEndTerm('*'),
      branchEndMetadata,
      new ElementContext(branchIndexes, ++index, true)
    );

    return new BranchNodeMaterial(
      Path.new([rootElement, ...intermediates, terminalElement]),
      graphBranchMetadata
    );
  }

  constructor(path: Path, graphBranchMetadata: GraphBranchMetadata) {
    this.path = path;
    this.graphBranchMetadata = graphBranchMetadata;
  }

  getPath(): Path {
    return this.path;
  }

  getRootKey(): string {
    return this.path.getRoot().getGraphKey();
  }

  getGraphKey(): string {
    return this.graphBranchMetadata.getKey();
  }

  getTerminal(): NodeElement {
    const nodeElement = this.path.getTerminal();
    if (!(nodeElement instanceof NodeElement)) {
      throw new Error();
    }

    return nodeElement;
  }

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }

  getRootVariableName(): string {
    return this.path.getRoot().getVariableName();
  }

  getFilter(): string {
    return `${this.getTerminal().getVariableName()}{.*}`;
  }

  getNodeElement(): AnyNodeElement {
    throw new Error();
  }
}
