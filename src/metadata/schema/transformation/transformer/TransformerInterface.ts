export interface TransformerInterface {
  restore(value: any): any;

  preserve(value: any): any;
}
