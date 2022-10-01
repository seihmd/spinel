import { TransformerInterface } from './TransformerInterface';

export class DummyTransformer implements TransformerInterface<any> {
  unparameterize(value: any): any {
    return value;
  }

  parameterize(value: any): any {
    return value;
  }
}
