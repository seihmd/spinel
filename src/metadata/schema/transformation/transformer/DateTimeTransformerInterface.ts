import { TransformerInterface } from './TransformerInterface';
import { DateTime } from 'neo4j-driver';
import { PlainDateTime } from '../plain/PlainDateTime';

export interface DateTimeTransformerInterface extends TransformerInterface {
  restore(value: PlainDateTime | null): any;

  preserve(value: any): DateTime<any> | null;
}
