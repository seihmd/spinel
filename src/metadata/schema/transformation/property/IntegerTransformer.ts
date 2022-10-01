import { TransformerInterface } from './TransformerInterface';
import { Integer } from 'neo4j-driver';
import { isRecord } from '../../../../util/isRecord';

export class IntegerTransformer implements TransformerInterface<Integer> {
  unparameterize(value: Integer): number {
    return value.toNumber();
  }

  parameterize(value: any): Integer {
    if (typeof value === 'number') {
      return Integer.fromNumber(value);
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
