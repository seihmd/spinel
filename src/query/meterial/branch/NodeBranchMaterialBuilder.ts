import { BranchEndTerm } from '../../../domain/graph/pattern/term/BranchEndTerm';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';
import { BRANCH_END } from '../../../domain/graph/pattern/term/modifiers';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { DirectionElement } from '../../element/DirectionElement';
import { ElementContext } from '../../element/ElementContext';
import { PlainEntity } from '../../element/PlainEntity';
import { Path } from '../../path/Path';
import { BranchIndexes } from '../BranchIndexes';
import { StemMaterial } from '../stem/StemMaterial';
import { BranchMaterialBuilderInterface } from './BranchMaterialBuilderInterface';
import { BranchMaterialInterface } from './BranchMaterialInterface';
import { ElementBuilderInterface } from './ElementBuilderInterface';
import { NodeBranchMaterial } from './NodeBranchMaterial';

export class NodeBranchMaterialBuilder
  implements BranchMaterialBuilderInterface<NodeBranchMaterial>
{
  private readonly elementBuilder: ElementBuilderInterface;

  constructor(elementBuilder: ElementBuilderInterface) {
    this.elementBuilder = elementBuilder;
  }

  build(
    graphBranchMetadata: GraphBranchMetadata,
    stemGraphMaterial: StemMaterial | BranchMaterialInterface,
    branchEndMetadata: NodeEntityMetadata,
    branchIndexes: BranchIndexes,
    plainEntity?: PlainEntity
  ): NodeBranchMaterial {
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

    const terminalElement = this.elementBuilder.buildNodeElement(
      new BranchEndTerm(BRANCH_END),
      new ElementContext(branchIndexes, ++index, true),
      branchEndMetadata,
      plainEntity
    );

    return new NodeBranchMaterial(
      Path.new([rootElement, ...intermediates, terminalElement]),
      graphBranchMetadata
    );
  }
}
