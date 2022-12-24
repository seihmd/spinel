import { AssociationReferenceTerm } from '../../../domain/graph/pattern/term/AssociationReferenceTerm';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { DirectionElement } from '../../element/DirectionElement';
import { Element } from '../../element/Element';
import { ElementContext } from '../../element/ElementContext';
import { PlainGraph } from '../../element/PlainGraph';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { reverseElement } from '../../element/reverseElement';
import { Path } from '../../path/Path';
import { BranchIndexes } from '../BranchIndexes';
import { StemMaterial } from '../stem/StemMaterial';
import { BranchMaterialBuilderInterface } from './BranchMaterialBuilderInterface';
import { BranchMaterialInterface } from './BranchMaterialInterface';
import { ElementBuilderInterface } from './ElementBuilderInterface';
import { GraphBranchMaterial } from './GraphBranchMaterial';

export class GraphBranchMaterialBuilder
  implements BranchMaterialBuilderInterface<GraphBranchMaterial>
{
  private readonly elementBuilder: ElementBuilderInterface;

  constructor(elementBuilder: ElementBuilderInterface) {
    this.elementBuilder = elementBuilder;
  }

  build(
    graphBranchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchEndMetadata: GraphMetadata,
    branchIndexes: BranchIndexes,
    plainGraph?: PlainGraph
  ): GraphBranchMaterial {
    const rootElement = stemMaterial.getNodeElement(
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
          return this.elementBuilder.buildNodeLabelElement(
            term,
            new ElementContext(branchIndexes, index, false)
          );
        }
        return this.elementBuilder.buildRelationshipTypeElement(
          term,
          new ElementContext(branchIndexes, index, false)
        );
      });

    let graphElements: Element[] = branchEndMetadata
      .getFormula()
      .get()
      .map((term) => {
        index++;
        if (term instanceof DirectionTerm) {
          return new DirectionElement(term);
        }
        if (term instanceof NodeLabelTerm) {
          return this.elementBuilder.buildNodeLabelElement(
            term,
            new ElementContext(branchIndexes, index, true)
          );
        }
        if (term instanceof NodeKeyTerm) {
          return this.elementBuilder.buildNodeElement(
            term,
            new ElementContext(branchIndexes, index, true),
            branchEndMetadata
              .getGraphNodeMetadata(term.getValue())
              .getEntityMetadata(),
            plainGraph?.getEntity(term.getKey())
          );
        }
        if (term instanceof RelationshipTypeTerm) {
          return new RelationshipTypeElement(
            term,
            new ElementContext(branchIndexes, index, true)
          );
        }

        return this.elementBuilder.buildRelationshipElement(
          term,
          new ElementContext(branchIndexes, index, true),
          branchEndMetadata
            .getGraphRelationshipMetadata(term.getValue())
            .getEntityMetadata(),
          plainGraph?.getEntity(term.getKey())
        );
      });

    const branchTerminalTerm = graphBranchMetadata.getTerminalTerm();
    if (!(branchTerminalTerm instanceof AssociationReferenceTerm)) {
      throw new Error();
    }
    const branchEndKey = branchTerminalTerm.getKey();
    const graphMetadataFormula = branchEndMetadata.getFormula();
    if (
      typeof branchEndKey === 'string' &&
      graphMetadataFormula.isTerminalKey(branchEndKey)
    ) {
      graphElements = reverseElement(graphElements);
    }

    return new GraphBranchMaterial(
      Path.new([rootElement, ...associationElements, ...graphElements]),
      graphBranchMetadata.getKey()
    );
  }
}
