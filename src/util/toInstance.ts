import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from '../domain/type/ClassConstructor';
import { embed } from '../metadata/schema/entity/embed';
import { getMetadataStore } from '../metadata/store/MetadataStore';

export function toInstance<T>(cstr: ClassConstructor<T>, plain: unknown): T {
  const nodeEntityMetadata = getMetadataStore().findNodeEntityMetadata(cstr);
  if (nodeEntityMetadata) {
    plain = embed(plain as Record<string, unknown>, nodeEntityMetadata);
  }

  const relationshipEntityMetadata =
    getMetadataStore().findRelationshipEntityMetadata(cstr);
  if (relationshipEntityMetadata) {
    plain = embed(plain as Record<string, unknown>, relationshipEntityMetadata);
  }

  const graphMetadata = getMetadataStore().findGraphMetadata(cstr);
  if (graphMetadata) {
    plain = embed(plain as Record<string, unknown>, graphMetadata);
  }

  return plainToInstance(cstr, plain, {
    excludeExtraneousValues: true,
  });
}
