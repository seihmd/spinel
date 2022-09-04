import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { EntityParameter } from '../parameter/EntityParameter';
import { Parameter } from '../parameter/Parameter';
import { ParameterValue } from '../parameter/ParameterValue';
import { NodeEntityMetadata } from '../../metadata/schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../../metadata/schema/entity/RelationshipEntityMetadata';
import { toPlain } from '../../util/toPlain';
import { GraphNodeMetadata } from '../../metadata/schema/graph/GraphNodeMetadata';

export abstract class InstanceElement<
  T extends NodeEntityMetadata | GraphNodeMetadata | RelationshipEntityMetadata
> {
  protected readonly instance: InstanceType<ClassConstructor<object>>;
  protected readonly metadata: T;

  protected constructor(
    instance: InstanceType<ClassConstructor<object>>,
    metadata: T
  ) {
    this.assert(instance, metadata);

    this.instance = instance;
    this.metadata = metadata;
  }

  abstract getVariableName(): string;

  getPrimaries(): EntityParameter {
    const properties = this.getProperties().toPlain();
    const primaryKeys = [this.getEntityMetadata().getPrimary().getNeo4jKey()];

    const primaries: Record<string, unknown> = {};
    primaryKeys.forEach((primaryKey) => {
      primaries[primaryKey] = properties[primaryKey];
    });

    return EntityParameter.withPlain(primaries, this.getVariableName());
  }

  getProperties(): EntityParameter {
    const value = toPlain(this.instance);
    return EntityParameter.withPlain(value, this.getVariableName());
  }

  getPropertiesParameter(): Parameter {
    return Parameter.new(
      this.getVariableName(),
      new ParameterValue(this.getProperties().toPlain())
    );
  }

  private assert(
    instance: InstanceType<ClassConstructor<object>>,
    metadata: T
  ): void {
    if (instance.constructor !== metadata.getCstr()) {
      throw new Error(
        `Constructor do not match: ${instance.constructor.name} vs ${
          metadata.getCstr().name
        }`
      );
    }
  }

  protected getEntityMetadata():
    | NodeEntityMetadata
    | RelationshipEntityMetadata {
    if (this.metadata instanceof GraphNodeMetadata) {
      return this.metadata.getEntityMetadata();
    }

    return this.metadata;
  }
}
