import { TransformerInterface } from './TransformerInterface';
import { LocalDateTime } from 'neo4j-driver';

export class LocalDateTimeTransformer
  implements TransformerInterface<LocalDateTime<number>>
{
  unparameterize(value: LocalDateTime<number>): Date {
    return value.toStandardDate();
  }

  parameterize(value: Date): LocalDateTime<number> {
    return LocalDateTime.fromStandardDate(value);
  }
}
