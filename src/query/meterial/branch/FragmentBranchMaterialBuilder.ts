import { BranchMaterialBuilderInterface } from './BranchMaterialBuilderInterface';
import { BranchIndexes } from '../BranchIndexes';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { ElementBuilderInterface } from './ElementBuilderInterface';
import { FragmentBranchMaterial } from './FragmentBranchMaterial';
import { GraphFragmentMetadata } from '../../../metadata/schema/graph/GraphFragmentMetadata';
import { StemMaterial } from '../stem/StemMaterial';
import { BranchMaterialInterface } from './BranchMaterialInterface';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';
import { DirectionElement } from '../../element/DirectionElement';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { ElementContext } from '../../element/ElementContext';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { BranchEndTerm } from '../../../domain/graph/pattern/term/BranchEndTerm';
import { Path } from '../../path/Path';
import { PlainGraph } from '../../element/PlainGraph';

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
        if (term instanceof RelationshipTypeTerm) {
          return this.elementBuilder.buildRelationshipTypeElement(
            term,
            new ElementContext(branchIndexes, index, true)
          );
        }
        if (term instanceof BranchEndTerm) {
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
