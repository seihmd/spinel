import { EntityLiteralOption } from './EntityLiteralOption';

export abstract class EntityLiteral {
  abstract get(option: Partial<EntityLiteralOption>): string;

  getOption(option: Partial<EntityLiteralOption>): EntityLiteralOption {
    return {
      ...{ variable: true, parameter: true, labelType: true },
      ...option,
    };
  }
}
