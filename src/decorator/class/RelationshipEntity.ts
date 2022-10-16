import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { IndexOption } from './IndexOption';

interface RelationshipEntityOption {
  type?: string;
  indexes?: IndexOption[];
}

export function RelationshipEntity(
  option: RelationshipEntityOption | null = null
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function _DecoratorName<T extends { new (...args: any[]): {} }>(
    cstr: T
  ) {
    getMetadataStore().registerRelationship(
      cstr,
      new RelationshipType(option?.type ?? cstr),
      option?.indexes ?? []
    );
  };
}
