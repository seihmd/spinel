import { NodeEntityMetadata } from '../entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../entity/RelationshipEntityMetadata';
import { GraphMetadata } from '../graph/GraphMetadata';
import { hasNoDuplicateProperties } from './hasNoDuplicateProperties';
import { validation } from './validation';

export class Validator {
  static entity(): Validator {
    return new Validator([hasNoDuplicateProperties]);
  }

  constructor(private readonly validations: validation[]) {}

  validate(
    metadata: NodeEntityMetadata | RelationshipEntityMetadata | GraphMetadata
  ) {
    for (const validation of this.validations) {
      validation(metadata);
    }
  }
}
