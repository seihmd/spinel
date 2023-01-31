import { Direction } from '../../../domain/graph/Direction';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import {
  AnyClassConstructor,
  ClassConstructor,
} from '../../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { isConstructor } from '../../../util/isConstructor';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { AnyNodeElement } from '../../element/Element';
import { ElementContext } from '../../element/ElementContext';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { Parameter } from '../../parameter/Parameter';
import { ParameterBag } from '../../parameter/ParameterBag';
import { DetachQuery } from './DetachQuery';
import { DetachStatement } from './DetachStatement';

export class DetachQueryBuilder {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly metadataStore: MetadataStoreInterface,
    private readonly node1:
      | InstanceType<ClassConstructor<object>>
      | ClassConstructor<object>,
    private readonly node2:
      | InstanceType<ClassConstructor<object>>
      | ClassConstructor<object>
      | null,
    private readonly relationship:
      | string
      | ClassConstructor<object>
      | null = null,
    private readonly direction: Direction = '->'
  ) {}

  buildQuery(): DetachQuery {
    const parameterBag = new ParameterBag();
    const nodeElement1 = this.getNodeElement(this.node1, 0);
    const nodeElements: AnyNodeElement[] = [nodeElement1];

    let nodeElement2 = null;
    if (this.node2) {
      nodeElement2 = this.getNodeElement(this.node2, 4);
      nodeElements.push(nodeElement2);
    }

    nodeElements
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

    return new DetachQuery(
      this.sessionProvider,
      new DetachStatement(
        nodeElement1,
        nodeElement2,
        this.getRelationshipElement(this.relationship),
        this.direction ?? '->'
      ),
      parameterBag
    );
  }

  private getNodeElement(
    node: InstanceType<ObjectConstructor> | ObjectConstructor,
    index: number
  ): NodeInstanceElement | NodeLabelElement {
    if (isConstructor(node)) {
      return new NodeLabelElement(
        NodeLabelTerm.withNodeLabel(
          new NodeLabel(
            this.metadataStore
              .getNodeEntityMetadata(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore-next-line
                isConstructor(node) ? node : node.constructor // eslint-disable-line @typescript-eslint/no-unsafe-argument
              )
              .getLabel()
              .toString()
          )
        ),
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
    relationship: string | ClassConstructor<object> | null
  ): RelationshipTypeElement | null {
    if (relationship === null) {
      return null;
    }

    const elementContext = new ElementContext(new BranchIndexes([]), 2, false);
    if (typeof relationship === 'string') {
      return new RelationshipTypeElement(
        RelationshipTypeTerm.withRelationshipType(
          new RelationshipType(
            typeof relationship === 'string'
              ? relationship
              : this.metadataStore
                  .getRelationshipEntityMetadata(relationship)
                  .getType()
                  .toString()
          )
        ),
        elementContext
      );
    }

    const relationshipMetadata =
      this.metadataStore.getRelationshipEntityMetadata(relationship);

    return new RelationshipTypeElement(
      RelationshipTypeTerm.withRelationshipType(relationshipMetadata.getType()),
      elementContext
    );
  }
}
