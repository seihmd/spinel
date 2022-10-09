import { TransformerInterface } from './TransformerInterface';
import { Date as Neo4jDate } from 'neo4j-driver';
import { PlainDate } from '../plain/PlainDate';

export interface DateTransformerInterface extends TransformerInterface {
  restore(value: PlainDate | null): any;

  preserve(value: any): Neo4jDate<any> | null;
}
