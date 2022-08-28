import { BranchMaterial } from './BranchMaterial';
import { GraphBranchMetadata } from '../../metadata/schema/graph/GraphBranchMetadata';
import { GraphMaterial } from './GraphMaterial';
import { DirectionElement } from '../element/DirectionElement';
import { NodeLabelElement } from '../element/NodeLabelElement';
import { NodeElement } from '../element/NodeElement';
import { Path } from '../path/Path';
import { RelationshipTypeElement } from '../element/RelationshipTypeElement';
import { RelationshipElement } from '../element/RelationshipElement';
import { GraphFragmentMetadata } from '../../metadata/schema/graph/GraphFragmentMetadata';
import { PathStep } from '../path/PathStep';
import { MapLiteral } from '../literal/MapLiteral';
import { AnyNodeElement } from '../element/Element';
import { DirectionTerm } from '../../domain/graph/pattern/term/DirectionTerm';
import { NodeLabelTerm } from '../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeKeyTerm } from '../../domain/graph/pattern/term/NodeKeyTerm';
import { BranchEndTerm } from '../../domain/graph/pattern/term/BranchEndTerm';
import { MapEntry } from '../literal/MapEntries';
import { MapEntryLiteral } from '../literal/MapEntryLiteral';
import { BranchIndexes } from './BranchIndexes';
import { ElementContext } from '../element/ElementContext';

export class BranchFragmentMaterial implements BranchMaterial {
  private readonly path: Path;
  private readonly graphBranchMetadata: GraphBranchMetadata;

  static new(
    graphBranchMetadata: GraphBranchMetadata,
    stemGraphMaterial: GraphMaterial | BranchMaterial,
    fragmentMetadata: GraphFragmentMetadata,
    branchIndexes: BranchIndexes
  ): BranchFragmentMaterial {
    const rootElement = stemGraphMaterial.getNodeElement(
      graphBranchMetadata.getRootKey(),
      branchIndexes.reduce()
    );
    let index = 0;
    const associationElements = graphBranchMetadata
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

    const graphElements = fragmentMetadata
      .getFormula()
      .get()
      .map((term) => {
        index++;
        if (term instanceof DirectionTerm) {
          return new DirectionElement(term);
        }
        if (term instanceof NodeLabelTerm) {
          return new NodeLabelElement(
            term,
            new ElementContext(branchIndexes, index, true)
          );
        }
        if (term instanceof NodeKeyTerm) {
          return new NodeElement(
            term,
            fragmentMetadata.getGraphNodeMetadata(term.getValue()),
            new ElementContext(branchIndexes, index, true)
          );
        }
        if (term instanceof RelationshipTypeTerm) {
          return new RelationshipTypeElement(
            term,
            new ElementContext(branchIndexes, index, true)
          );
        }
        if (term instanceof BranchEndTerm) {
          throw new Error();
        }

        return new RelationshipElement(
          term,
          fragmentMetadata.getGraphRelationshipMetadata(term.getValue()),
          new ElementContext(branchIndexes, index, true)
        );
      });

    return new BranchFragmentMaterial(
      Path.new([rootElement, ...associationElements, ...graphElements]),
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

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }

  getRootVariableName(): string {
    return this.path.getRoot().getVariableName();
  }

  getFilter(): string {
    const entries: MapEntry[] = [];

    this.getSteps().forEach((step) => {
      if (step.getRelationship().getGraphKey() !== '') {
        entries.push([
          step.getRelationship().getGraphKey(),
          `${step.getRelationship().getVariableName()}{.*}`,
        ]);
      }
      if (step.getNode().getGraphKey() !== '') {
        entries.push([
          step.getNode().getGraphKey(),
          `${step.getNode().getVariableName()}{.*}`,
        ]);
      }
    });

    return new MapLiteral(MapEntryLiteral.new(entries)).get();
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
