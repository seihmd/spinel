import { BranchMaterialBuilderInterface } from './BranchMaterialBuilderInterface';
import { NodeBranchMaterial } from './NodeBranchMaterial';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { BranchIndexes } from '../BranchIndexes';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';
import { DirectionElement } from '../../element/DirectionElement';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { ElementContext } from '../../element/ElementContext';
import { BranchEndTerm } from '../../../domain/graph/pattern/term/BranchEndTerm';
import { Path } from '../../path/Path';
import { ElementBuilderInterface } from './ElementBuilderInterface';
import { StemMaterial } from '../stem/StemMaterial';
import { BranchMaterialInterface } from './BranchMaterialInterface';
import { PlainEntity } from '../../element/PlainEntity';

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
      new BranchEndTerm('*'),
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
