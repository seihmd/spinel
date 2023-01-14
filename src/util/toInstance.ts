import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from '../domain/type/ClassConstructor';
import { embed } from '../metadata/schema/entity/embed';
import { getMetadataStore } from '../metadata/store/MetadataStore';
import { isRecord } from './isRecord';

export function toInstance<T>(
  cstr: ClassConstructor<T>,
  plain: unknown
): T | T[] {
  if (Array.isArray(plain)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return plain.map((v) => toInstance(cstr, v));
  }

  if (!isRecord(plain)) {
    throw new Error('Unexpected value');
  }

  const nodeEntityMetadata = getMetadataStore().findNodeEntityMetadata(cstr);
  if (nodeEntityMetadata) {
    return to(cstr, embed(plain, nodeEntityMetadata));
  }

  const relationshipEntityMetadata =
    getMetadataStore().findRelationshipEntityMetadata(cstr);
  if (relationshipEntityMetadata) {
    return to(cstr, embed(plain, relationshipEntityMetadata));
  }

  const graphMetadata = getMetadataStore().findGraphMetadata(cstr);
  if (graphMetadata) {
    return to(cstr, embed(plain, graphMetadata));
  }

  return to(cstr, plain);
}

function to<T>(cstr: ClassConstructor<T>, plain: unknown): T {
  return plainToInstance(cstr, plain, {
    excludeExtraneousValues: true,
  });
}
