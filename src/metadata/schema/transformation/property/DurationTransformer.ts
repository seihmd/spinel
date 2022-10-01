import { TransformerInterface } from './TransformerInterface';
import { Duration } from 'neo4j-driver';
import { isRecord } from '../../../../util/isRecord';

export class DurationTransformer
  implements TransformerInterface<Duration<number>>
{
  unparameterize(value: Duration<number>): Duration<number> {
    return value;
  }

  parameterize(value: any): Duration<number> {
    if (isPlainDuration(value)) {
      return new Duration(
        value.months,
        value.days,
        value.seconds,
        value.nanoseconds
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}

function isPlainDuration(value: any): value is {
  months: number;
  days: number;
  seconds: number;
  nanoseconds: number;
} {
  if (!isRecord(value)) {
    return false;
  }

  return (
    'months' in value &&
    'days' in value &&
    'seconds' in value &&
    'nanoseconds' in value
  );
}
