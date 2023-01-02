import { instanceToPlain } from 'class-transformer';
import { AnyClassConstructor } from '../domain/type/ClassConstructor';
import { digUp } from '../metadata/schema/entity/digUp';
import { getMetadataStore } from '../metadata/store/MetadataStore';

export function toPlain(instance: object): Record<string, unknown> {
  const plain = instanceToPlain(instance, {
    excludeExtraneousValues: true,
  });

  const nodeEntityMetadata = getMetadataStore().findNodeEntityMetadata(
    instance.constructor as AnyClassConstructor
  );
  if (nodeEntityMetadata) {
    return digUp(plain as Record<string, unknown>, nodeEntityMetadata);
  }

  const relationshipEntityMetadata =
    getMetadataStore().findRelationshipEntityMetadata(
      instance.constructor as AnyClassConstructor
    );
  if (relationshipEntityMetadata) {
    return digUp(plain as Record<string, unknown>, relationshipEntityMetadata);
  }

  const graphMetadata = getMetadataStore().findGraphMetadata(
    instance.constructor as AnyClassConstructor
  );
  if (graphMetadata) {
    return digUp(plain as Record<string, unknown>, graphMetadata);
  }

  throw new Error();
}
