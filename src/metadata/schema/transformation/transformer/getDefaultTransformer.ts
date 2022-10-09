import { PropertyType } from '../../entity/PropertyType';
import { DateTimeTransformer } from './default/DateTimeTransformer';
import { TransformerInterface } from './TransformerInterface';
import { NothingTransformer } from './NothingTransformer';
import { PrimaryType } from '../../entity/PrimaryType';
import { NumberTransformer } from './default/NumberTransformer';

export const getDefaultTransformer = (
  propertyType: PropertyType | PrimaryType
): TransformerInterface => {
  if (propertyType.getType() === Date) {
    return new DateTimeTransformer();
  }

  if (propertyType.getType() === Number) {
    return new NumberTransformer();
  }

  return new NothingTransformer();
};
