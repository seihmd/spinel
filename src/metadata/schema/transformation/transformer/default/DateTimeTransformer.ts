import { Date as Neo4jDate, DateTime } from 'neo4j-driver';
import { PlainDateTime } from '../../plain/PlainDateTime';
import { DateTimeTransformerInterface } from '../DateTimeTransformerInterface';

export class DateTimeTransformer implements DateTimeTransformerInterface {
  preserve(value: Date | null): DateTime<any> | null {
    if (!value) {
      return null;
    }
    return DateTime.fromStandardDate(value);
  }

  restore(value: PlainDateTime | Date | Neo4jDate | null): Date | null {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return value;
    }
    if (value instanceof Neo4jDate) {
      return value.toStandardDate();
    }

    return new DateTime(
      value.year,
      value.month,
      value.day,
      value.hour,
      value.minute,
      value.second,
      value.nanosecond,
      value.timeZoneOffsetSeconds,
      value.timeZoneId
    ).toStandardDate();
  }
}
