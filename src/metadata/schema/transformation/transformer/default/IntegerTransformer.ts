import { IntegerTransformerInterface } from '../IntegerTransformerInterface';
import { Integer } from 'neo4j-driver';
import { PlainInteger } from '../../plain/PlainInteger';

export class IntegerTransformer implements IntegerTransformerInterface {
  preserve(value: number | null): Integer | null {
    if (value === null) {
      return null;
    }
    return Integer.fromValue(value);
  }

  restore(value: PlainInteger | null): number | null {
    if (value === null) {
      return value;
    }

    return new Integer(value.low, value.high).toNumber();
  }
}
