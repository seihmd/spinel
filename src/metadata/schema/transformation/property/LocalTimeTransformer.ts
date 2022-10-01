import { TransformerInterface } from './TransformerInterface';
import { LocalTime } from 'neo4j-driver';

export class LocalTimeTransformer
  implements TransformerInterface<LocalTime<number>>
{
  unparameterize(value: LocalTime<number>): Date {
    return new Date(value.toString());
  }

  parameterize(value: Date): LocalTime<number> {
    return LocalTime.fromStandardDate(value);
  }
}
