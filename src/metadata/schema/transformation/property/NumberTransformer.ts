import { TransformerInterface } from './TransformerInterface';
import { Integer } from 'neo4j-driver';
import { isRecord } from '../../../../util/isRecord';
import { isBigInt } from '../../../../util/isBigInt';

export class NumberTransformer
  implements TransformerInterface<Integer | number>
{
  unparameterize(value: Integer | number): number {
    if (value instanceof Integer) {
      return value.toNumber();
    }
    return value;
  }

  parameterize(value: any): Integer | number {
    if (typeof value === 'number') {
      if (isBigInt(value)) {
        return Integer.fromNumber(value);
      }
      return value;
    }
    if (value instanceof Integer) {
      return value;
    }
    if (isPlainInteger(value)) {
      return new Integer(value.low, value.high);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Integer.fromValue(value);
  }
}

function isPlainInteger(value: any): value is { low: number; high: number } {
  if (!isRecord(value)) {
    return false;
  }

  return 'low' in value && 'high' in value;
}
