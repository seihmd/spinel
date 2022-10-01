import { toInstance } from '../../../util/toInstance';
import { TransformationRules } from './property/TransformationRules';
import { toPlain } from '../../../util/toPlain';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { TransformationRule } from './property/TransformationRule';

export class EntityTransformer {
  private readonly transformationRules: TransformationRules;

  constructor(transformationRules: TransformationRules) {
    this.transformationRules = transformationRules;
  }

  parameterize(instance: Object): Record<string, unknown> {
    return this.transform(
      toPlain(instance),
      (value: unknown, rule: TransformationRule) => {
        return rule.parameterize(value);
      }
    );
  }

  unparameterize<T>(
    plain: Record<string, unknown>,
    cstr: ClassConstructor<T>
  ): T {
    return toInstance(
      cstr,
      this.transform(plain, (value: unknown, rule: TransformationRule) => {
        return rule.unparameterize(value);
      })
    );
  }

  private transform(
    plain: Record<string, unknown>,
    transformation: (value: unknown, rule: TransformationRule) => unknown
  ): Record<string, unknown> {
    Object.keys(plain).forEach((key) => {
      const transformationRule = this.transformationRules.get(key);
      if (!transformationRule) {
        return;
      }
      plain[key] = transformation(plain[key], transformationRule);
    });

    return plain;
  }
}
