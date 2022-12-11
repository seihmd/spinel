import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import {
  AnyClassConstructor,
  ClassConstructor,
} from '../../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { ElementContext } from '../../element/ElementContext';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { Parameter } from '../../parameter/Parameter';
import { ParameterBag } from '../../parameter/ParameterBag';
import { DeleteNodeQuery } from './DeleteNodeQuery';
import { DeleteRelationshipQuery } from './DeleteRelationshipQuery';

/**
 * @deprecated
 */
export class DeleteQueryBuilder {
  static new(): DeleteQueryBuilder {
    return new DeleteQueryBuilder(getMetadataStore());
  }

  private readonly metadataStore: MetadataStoreInterface;

  constructor(metadataStore: MetadataStoreInterface) {
    this.metadataStore = metadataStore;
  }

  build(
    instance: InstanceType<ClassConstructor<object>>,
    detach: boolean
  ): [DeleteNodeQuery | DeleteRelationshipQuery, ParameterBag] {
    const parameterBag = new ParameterBag();
    const cstr = instance.constructor as AnyClassConstructor;
    const nodeMetadata = this.metadataStore.findNodeEntityMetadata(cstr);

    if (nodeMetadata) {
      const nodeInstanceElement = new NodeInstanceElement(
        instance,
        nodeMetadata,
        new ElementContext(new BranchIndexes([]), 0, false),
        new NodeKeyTerm('_')
      );

      parameterBag.add(
        Parameter.new(
          nodeInstanceElement.getVariableName(),
          nodeInstanceElement.getProperties().parameterize()
        )
      );
      return [new DeleteNodeQuery(nodeInstanceElement, detach), parameterBag];
    }

    const relationshipMetadata =
      this.metadataStore.findRelationshipEntityMetadata(cstr);
    if (relationshipMetadata) {
      const relationshipInstanceElement = new RelationshipInstanceElement(
        instance,
        relationshipMetadata,
        new ElementContext(new BranchIndexes([]), 0, false),
        new RelationshipKeyTerm('r')
      );
      parameterBag.add(
        Parameter.new(
          relationshipInstanceElement.getVariableName(),
          relationshipInstanceElement.getProperties().parameterize()
        )
      );
      return [
        new DeleteRelationshipQuery(relationshipInstanceElement),
        parameterBag,
      ];
    }

    throw new Error(
      `Constructor of instance: "${cstr.name}" is not registered as NodeEntity or RelationshipEntity`
    );
  }
}
