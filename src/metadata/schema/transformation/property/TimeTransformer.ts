import { TransformerInterface } from './TransformerInterface';
import { Time } from 'neo4j-driver';

export class TimeTransformer implements TransformerInterface<Time<number>> {
  unparameterize(value: Time<number>): Date {
    console.log(new Date(value.toString()));

    const d = new Date();
    d.setHours(value.hour);
    d.setMinutes(value.minute);
    d.setSeconds(value.second);
    d.setMilliseconds(value.nanosecond * 1000);
    return d;
  }

  parameterize(value: Date): Time<number> {
    return Time.fromStandardDate(value);
  }
}
