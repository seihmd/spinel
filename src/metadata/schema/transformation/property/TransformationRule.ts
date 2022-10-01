import { EntityPropertyMetadata } from 'metadata/schema/entity/EntityPropertyMetadata';
import { TransformerInterface } from './TransformerInterface';
import { isConstructor } from '../../../../util/isConstructor';
import { IntegerTransformer } from './IntegerTransformer';
import { DateTransformer } from './DateTransformer';
import { TimeTransformer } from './TimeTransformer';
import { DateTimeTransformer } from './DateTimeTransformer';
import { LocalTimeTransformer } from './LocalTimeTransformer';
import { LocalDateTimeTransformer } from './LocalDateTimeTransformer';
import {
  Date as Neo4jDate,
  DateTime,
  Duration,
  Integer,
  LocalDateTime,
  LocalTime,
  Point,
  Time,
} from 'neo4j-driver';
import { DurationTransformer } from './DurationTransformer';
import { PointTransformer } from './PointTransformer';
import { DummyTransformer } from './DummyTransformer';

export class TransformationRule {
  static new(propertyMetadata: EntityPropertyMetadata) {
    if (propertyMetadata.getNeo4jPropertyType() === 'integer') {
      return new TransformationRule(propertyMetadata, new IntegerTransformer());
    }
    if (propertyMetadata.getNeo4jPropertyType() === 'date') {
      return new TransformationRule(propertyMetadata, new DateTransformer());
    }
    if (propertyMetadata.getNeo4jPropertyType() === 'time') {
      return new TransformationRule(propertyMetadata, new TimeTransformer());
    }
    if (propertyMetadata.getNeo4jPropertyType() === 'datetime') {
      return new TransformationRule(
        propertyMetadata,
        new DateTimeTransformer()
      );
    }
    if (propertyMetadata.getNeo4jPropertyType() === 'local-time') {
      return new TransformationRule(
        propertyMetadata,
        new LocalTimeTransformer()
      );
    }
    if (propertyMetadata.getNeo4jPropertyType() === 'local-datetime') {
      return new TransformationRule(
        propertyMetadata,
        new LocalDateTimeTransformer()
      );
    }
    if (propertyMetadata.getType() instanceof Integer) {
      return new TransformationRule(propertyMetadata, new IntegerTransformer());
    }
    if (propertyMetadata.getType() instanceof Neo4jDate) {
      return new TransformationRule(propertyMetadata, new DateTransformer());
    }
    if (propertyMetadata.getType() instanceof Time) {
      return new TransformationRule(propertyMetadata, new TimeTransformer());
    }
    if (propertyMetadata.getType() instanceof DateTime) {
      return new TransformationRule(
        propertyMetadata,
        new DateTimeTransformer()
      );
    }
    if (propertyMetadata.getType() instanceof LocalTime) {
      return new TransformationRule(
        propertyMetadata,
        new LocalTimeTransformer()
      );
    }
    if (propertyMetadata.getType() instanceof LocalDateTime) {
      return new TransformationRule(
        propertyMetadata,
        new LocalDateTimeTransformer()
      );
    }
    if (propertyMetadata.getType() instanceof Duration) {
      return new TransformationRule(
        propertyMetadata,
        new DurationTransformer()
      );
    }
    if (propertyMetadata.getType() instanceof Point) {
      return new TransformationRule(propertyMetadata, new PointTransformer());
    }

    return new TransformationRule(propertyMetadata, new DummyTransformer());
  }

  private readonly propertyMetadata: EntityPropertyMetadata;
  private readonly transformer: TransformerInterface<any>;

  constructor(
    propertyMetadata: EntityPropertyMetadata,
    transformer: TransformerInterface<any>
  ) {
    this.propertyMetadata = propertyMetadata;
    this.transformer = transformer;
  }

  getKey(): string {
    return this.propertyMetadata.getKey();
  }

  unparameterize(value: unknown): any {
    const propertyType = this.propertyMetadata.getType();
    if (isConstructor(propertyType) && value instanceof propertyType) {
      return value;
    }

    return this.transformer.unparameterize(value);
  }

  parameterize(value: unknown): any {
    return this.transformer.parameterize(value);
  }
}
