import { TransformerInterface } from './TransformerInterface';

export class NothingTransformer implements TransformerInterface {
  preserve(value: any): any {
    return value;
  }

  restore(value: any): any {
    return value;
  }
}
