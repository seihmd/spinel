import { NodeEntityMetadata } from '../entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../entity/RelationshipEntityMetadata';
import { PropertiesDuplicateError } from '../errors/PropertiesDuplicateError';
import { GraphMetadata } from '../graph/GraphMetadata';
import { validation } from './validation';

export const hasNoDuplicateProperties: validation = (
  metadata: NodeEntityMetadata | RelationshipEntityMetadata | GraphMetadata
): void => {
  if (metadata instanceof GraphMetadata) {
    return;
  }

  const names = [metadata.getPrimary(), ...metadata.getProperties()].map((p) =>
    p.getNeo4jKey()
  );
  if (names.length === new Set(names).size) {
    return;
  }

  const duplicate = names.find((name, index) => {
    return names.indexOf(name) !== index;
  });
  throw new PropertiesDuplicateError(metadata.getCstr(), duplicate ?? '');
};
