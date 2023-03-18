import { Date as Neo4jDate } from 'neo4j-driver';
import { PlainDate } from '../../plain/PlainDate';
import { DateTransformerInterface } from '../DateTransformerInterface';

export class DateTransformer implements DateTransformerInterface {
  preserve(value: Date | null): Neo4jDate<any> | null {
    if (!value) {
      return null;
    }
    return Neo4jDate.fromStandardDate(value);
  }

  restore(value: PlainDate | null): Date | null {
    if (!value) {
      return null;
    }
    return new Neo4jDate(value.year, value.month, value.day).toStandardDate();
  }
}
