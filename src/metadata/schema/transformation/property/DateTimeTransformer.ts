import { TransformerInterface } from './TransformerInterface';
import { DateTime } from 'neo4j-driver';

export class DateTimeTransformer
  implements TransformerInterface<DateTime<number>>
{
  unparameterize(value: DateTime<number>): Date {
    return value.toStandardDate();
  }

  parameterize(value: Date): DateTime<number> {
    return DateTime.fromStandardDate(value);
  }
}
