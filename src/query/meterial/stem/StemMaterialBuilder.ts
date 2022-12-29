import { AssociationReferenceTerm } from '../../../domain/graph/pattern/term/AssociationReferenceTerm';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { DirectionElement } from '../../element/DirectionElement';
import { ElementContext } from '../../element/ElementContext';
import { NodeElement } from '../../element/NodeElement';
import { PlainGraph } from '../../element/PlainGraph';
import { Path } from '../../path/Path';
import { BranchIndexes } from '../BranchIndexes';
import { ElementBuilderInterface } from './ElementBuilderInterface';
import { StemMaterial } from './StemMaterial';

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
        if (term instanceof AssociationReferenceTerm) {
          throw new Error('AssociationReferenceTerm found.');
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
