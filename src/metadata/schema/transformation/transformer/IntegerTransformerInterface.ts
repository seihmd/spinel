import { TransformerInterface } from './TransformerInterface';
import { Integer } from 'neo4j-driver';
import { PlainInteger } from '../plain/PlainInteger';

export interface IntegerTransformerInterface extends TransformerInterface {
  restore(value: PlainInteger | null): any;

  preserve(value: any): Integer | null;
}
