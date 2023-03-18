import { DateTime } from 'neo4j-driver';
import { PlainDateTime } from '../../plain/PlainDateTime';
import { DateTimeTransformerInterface } from '../DateTimeTransformerInterface';

export class DateTimeTransformer implements DateTimeTransformerInterface {
  preserve(value: Date | null): DateTime<any> | null {
    if (!value) {
      return null;
    }
    return DateTime.fromStandardDate(value);
  }

  restore(value: PlainDateTime | Date | null): Date | null {
    if (!value) {
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
