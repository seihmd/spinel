export interface TransformerInterface<T> {
  unparameterize(value: T): any;

  parameterize(value: any): T;
}
