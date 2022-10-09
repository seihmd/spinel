import { TransformerInterface } from '../TransformerInterface';
import { Integer } from 'neo4j-driver';
import { PlainInteger } from '../../plain/PlainInteger';

export class NumberTransformer implements TransformerInterface {
  preserve(value: number | null): Integer | number | null {
    if (value === null) {
      return null;
    }
    if (Number.isInteger(value)) {
      return Integer.fromValue(value);
    }

    return value;
  }

  restore(value: PlainInteger | number | null): number | null {
    if (value === null) {
      return null;
    }
    if (typeof value === 'number') {
      return value;
    }

    return new Integer(value.low, value.high).toNumber();
  }
}
