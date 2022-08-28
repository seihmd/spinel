import { BranchMaterial } from './BranchMaterial';
import { GraphBranchMetadata } from '../../metadata/schema/graph/GraphBranchMetadata';
import { GraphMaterial } from './GraphMaterial';
import { DirectionElement } from '../element/DirectionElement';
import { NodeLabelElement } from '../element/NodeLabelElement';
import { NodeElement } from '../element/NodeElement';
import { Path } from '../path/Path';
import { GraphMetadata } from '../../metadata/schema/graph/GraphMetadata';
import { RelationshipTypeElement } from '../element/RelationshipTypeElement';
import { RelationshipElement } from '../element/RelationshipElement';
import { reverseElement } from '../element/reverseElement';
import { PathStep } from '../path/PathStep';
import { MapLiteral } from '../literal/MapLiteral';
import { AnyNodeElement } from '../element/Element';
import { Branch } from '../path/Branch';
import { GraphParameter } from '../parameter/GraphParameter';
import { DirectionTerm } from '../../domain/graph/pattern/term/DirectionTerm';
import { NodeLabelTerm } from '../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeKeyTerm } from '../../domain/graph/pattern/term/NodeKeyTerm';
import { BranchEndTerm } from '../../domain/graph/pattern/term/BranchEndTerm';
import { MapEntry } from '../literal/MapEntries';
import { MapEntryLiteral } from '../literal/MapEntryLiteral';
import { BranchIndexes } from './BranchIndexes';
import { ElementContext } from '../element/ElementContext';

export class BranchGraphMaterial implements BranchMaterial {
  private readonly path: Path;
  private readonly graphKey: string;

  static new(
    graphBranchMetadata: GraphBranchMetadata,
    stemGraphMaterial: GraphMaterial | BranchMaterial,
    branchGraphMetadata: GraphMetadata,
    branchIndexes: BranchIndexes
  ): BranchGraphMaterial {
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

    let graphElements = branchGraphMetadata
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
            branchGraphMetadata.getGraphNodeMetadata(term.getValue()),
            new ElementContext(branchIndexes, index, true)
          );
        }
        if (term instanceof RelationshipTypeTerm) {
          return new RelationshipTypeElement(
            term,
            new ElementContext(branchIndexes, index, true)
          );
        }

        return new RelationshipElement(
          term,
          branchGraphMetadata.getGraphRelationshipMetadata(term.getValue()),
          new ElementContext(branchIndexes, index, true)
        );
      });

    const branchTerminalTerm = graphBranchMetadata.getTerminalTerm();
    if (!(branchTerminalTerm instanceof BranchEndTerm)) {
      throw new Error();
    }
    const branchEndKey = branchTerminalTerm.getKey();
    const graphMetadataFormula = branchGraphMetadata.getFormula();
    if (
      typeof branchEndKey === 'string' &&
      graphMetadataFormula.isTerminalKey(branchEndKey)
    ) {
      graphElements = reverseElement(graphElements);
    }

    return new BranchGraphMaterial(
      Path.new([rootElement, ...associationElements, ...graphElements]),
      graphBranchMetadata.getKey()
    );
  }

  constructor(path: Path, graphKey: string) {
    this.path = path;
    this.graphKey = graphKey;
  }

  getPath(): Path {
    return this.path;
  }

  getRootKey(): string {
    return this.path.getRoot().getGraphKey();
  }

  getGraphKey(): string {
    return this.graphKey;
  }

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }

  getRootVariableName(): string {
    return this.path.getRoot().getVariableName();
  }

  getFilter(branches: Branch[]): string {
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

    branches.forEach((branch) => {
      entries.push([
        branch.getGraphKey(),
        branch.toPatternComprehensionLiteral(new GraphParameter('', {})).get(),
      ]);
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
