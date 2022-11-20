import {
  AnyClassConstructor,
  ClassConstructor,
} from '../../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { DeleteNodeQuery } from './DeleteNodeQuery';
import { DeleteRelationshipQuery } from './DeleteRelationshipQuery';

export class DeleteQueryBuilder {
  private readonly metadataStore: MetadataStoreInterface;

  constructor(metadataStore: MetadataStoreInterface) {
    this.metadataStore = metadataStore;
  }

  build(
    instance: InstanceType<ClassConstructor<object>>,
    detach: boolean
  ): DeleteNodeQuery | DeleteRelationshipQuery {
    const cstr = instance.constructor as AnyClassConstructor;
    const nodeMetadata = this.metadataStore.findNodeEntityMetadata(cstr);

    if (nodeMetadata) {
      return new DeleteNodeQuery(instance, nodeMetadata, detach);
    }

    const relationshipMetadata =
      this.metadataStore.findRelationshipEntityMetadata(cstr);
    if (relationshipMetadata) {
      return new DeleteRelationshipQuery(instance, relationshipMetadata);
    }

    throw new Error(
      `Constructor of instance: "${cstr.name}" is not registered as NodeEntity or RelationshipEntity`
    );
  }
}
