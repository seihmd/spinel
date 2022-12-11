import {
  AnyClassConstructor,
  ClassConstructor,
} from '../../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { ParameterBag } from '../../parameter/ParameterBag';
import { Parameter } from '../../parameter/Parameter';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { ElementContext } from '../../element/ElementContext';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { DetachQuery } from './DetachQuery';
import { Direction } from '../../../domain/graph/Direction';

export class DetachQueryBuilder {
  static new(): DetachQueryBuilder {
    return new DetachQueryBuilder(getMetadataStore());
  }

  private readonly metadataStore: MetadataStoreInterface;

  constructor(metadataStore: MetadataStoreInterface) {
    this.metadataStore = metadataStore;
  }

  build(
    node1: InstanceType<ClassConstructor<object>> | NodeLabel,
    relationshipType: RelationshipType,
    node2: InstanceType<ClassConstructor<object>> | NodeLabel,
    direction: Direction
  ): [DetachQuery, ParameterBag] {
    const parameterBag = new ParameterBag();
    const nodeElement1 = this.getNodeElement(node1, 0);
    const nodeElement2 = this.getNodeElement(node2, 4);

    [nodeElement1, nodeElement2]
      .filter(
        (nodeElement): nodeElement is NodeInstanceElement =>
          nodeElement instanceof NodeInstanceElement
      )
      .forEach((nodeElement) => {
        parameterBag.add(
          Parameter.new(
            nodeElement.getVariableName(),
            nodeElement.getProperties().parameterize()
          )
        );
      });

    return [
      new DetachQuery(
        nodeElement1,
        this.getRelationshipElement(relationshipType),
        nodeElement2,
        direction
      ),
      parameterBag,
    ];
  }

  private getNodeElement(
    node: InstanceType<ClassConstructor<object>> | NodeLabel,
    index: number
  ): NodeInstanceElement | NodeLabelElement {
    if (node instanceof NodeLabel) {
      return new NodeLabelElement(
        NodeLabelTerm.withNodeLabel(node),
        new ElementContext(new BranchIndexes([]), index, false)
      );
    }

    const cstr = node.constructor as AnyClassConstructor;
    const nodeMetadata = this.metadataStore.getNodeEntityMetadata(cstr);

    return new NodeInstanceElement(
      node,
      nodeMetadata,
      new ElementContext(new BranchIndexes([]), index, false),
      new NodeKeyTerm('_')
    );
  }

  private getRelationshipElement(
    relationshipType: RelationshipType
  ): RelationshipTypeElement {
    return new RelationshipTypeElement(
      RelationshipTypeTerm.withRelationshipType(relationshipType),
      new ElementContext(new BranchIndexes([]), 2, false)
    );
  }
}
