import { AssociationReferenceTerm } from '../../../domain/graph/pattern/term/AssociationReferenceTerm';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { GraphFragmentMetadata } from '../../../metadata/schema/graph/GraphFragmentMetadata';
import { DirectionElement } from '../../element/DirectionElement';
import { ElementContext } from '../../element/ElementContext';
import { PlainGraph } from '../../element/PlainGraph';
import { Path } from '../../path/Path';
import { BranchIndexes } from '../BranchIndexes';
import { StemMaterial } from '../stem/StemMaterial';
import { BranchMaterialBuilderInterface } from './BranchMaterialBuilderInterface';
import { BranchMaterialInterface } from './BranchMaterialInterface';
import { ElementBuilderInterface } from './ElementBuilderInterface';
import { FragmentBranchMaterial } from './FragmentBranchMaterial';

export class FragmentBranchMaterialBuilder
  implements BranchMaterialBuilderInterface<FragmentBranchMaterial>
{
  private readonly elementBuilder: ElementBuilderInterface;

  constructor(elementBuilder: ElementBuilderInterface) {
    this.elementBuilder = elementBuilder;
  }

  build(
    graphBranchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchEndMetadata: GraphFragmentMetadata,
    branchIndexes: BranchIndexes,
    plainGraph?: PlainGraph
  ): FragmentBranchMaterial {
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

    const graphElements = branchEndMetadata
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
        if (term instanceof AssociationReferenceTerm) {
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
          return this.elementBuilder.buildRelationshipTypeElement(
            term,
            new ElementContext(branchIndexes, index, true)
          );
        }
        if (term instanceof AssociationReferenceTerm) {
          throw new Error();
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

    return new FragmentBranchMaterial(
      Path.new([rootElement, ...associationElements, ...graphElements]),
      graphBranchMetadata
    );
  }
}
