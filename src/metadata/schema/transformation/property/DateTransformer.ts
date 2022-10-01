import { TransformerInterface } from './TransformerInterface';
import { Date as Neo4jDate } from 'neo4j-driver';

export class DateTransformer
  implements TransformerInterface<Neo4jDate<number>>
{
  unparameterize(value: Neo4jDate<number>): Date {
    return value.toStandardDate();
  }

  parameterize(value: Date): Neo4jDate<number> {
    return Neo4jDate.fromStandardDate(value);
  }
}
