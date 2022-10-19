import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { DirectionElement } from '../../element/DirectionElement';
import { Path } from '../../path/Path';
import { ElementBuilderInterface } from './ElementBuilderInterface';
import { StemMaterial } from './StemMaterial';
import { PlainGraph } from '../../element/PlainGraph';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { NodeElement } from '../../element/NodeElement';
import { ElementContext } from '../../element/ElementContext';
import { BranchIndexes } from '../BranchIndexes';

export class StemMaterialBuilder {
  private elementBuilder: ElementBuilderInterface;

  constructor(elementBuilder: ElementBuilderInterface) {
    this.elementBuilder = elementBuilder;
  }

  build(
    metadata: GraphMetadata | NodeEntityMetadata,
    instance?: PlainGraph
  ): StemMaterial {
    if (metadata instanceof NodeEntityMetadata) {
      return new StemMaterial(
        Path.new([
          new NodeElement(
            new NodeKeyTerm('n'),
            metadata,
            new ElementContext(new BranchIndexes([]), 0, false)
          ),
        ])
      );
    }

    const elements = metadata
      .getFormula()
      .get()
      .map((term, i) => {
        if (term instanceof NodeKeyTerm) {
          return this.elementBuilder.createNodeElement(
            term,
            i,
            metadata,
            instance?.getEntity(term.getKey())
          );
        }
        if (term instanceof NodeLabelTerm) {
          return this.elementBuilder.createNodeLabelElement(term, i);
        }
        if (term instanceof RelationshipKeyTerm) {
          return this.elementBuilder.createRelationshipElement(
            term,
            i,
            metadata,
            instance?.getEntity(term.getKey())
          );
        }
        if (term instanceof RelationshipTypeTerm) {
          return this.elementBuilder.createRelationshipTypeElement(term, i);
        }
        return new DirectionElement(term);
      });

    return new StemMaterial(Path.new(elements));
  }
}
