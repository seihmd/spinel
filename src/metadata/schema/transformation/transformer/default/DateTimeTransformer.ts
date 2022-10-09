import { DateTime } from 'neo4j-driver';
import { DateTimeTransformerInterface } from '../DateTimeTransformerInterface';
import { PlainDateTime } from '../../plain/PlainDateTime';

export class DateTimeTransformer implements DateTimeTransformerInterface {
  preserve(value: Date | null): DateTime<any> | null {
    if (value === null) {
      return null;
    }
    return DateTime.fromStandardDate(value);
  }

  restore(value: PlainDateTime | Date | null): Date | null {
    if (value === null) {
      return null;
    }
    if (value instanceof Date) {
      return value;
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
