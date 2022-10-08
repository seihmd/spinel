import { Parameter } from './Parameter';
import { TransformationRules } from '../../metadata/schema/transformation/property/TransformationRules';

type Value = { [key: string]: Parameter };
type Schema<T> = { [key: string]: T };
export type PlainEntityParameter = Schema<unknown>;
export type ParameterizedEntityParameter = Schema<string>;

export class EntityParameter {
  static withPlain(
    plain: PlainEntityParameter,
    graphKey: string | null,
    transformationRules: TransformationRules
  ): EntityParameter {
    const value = Object.entries(plain).reduce(
      (prev: Value, [key, value]: [string, unknown]) => {
        const parameterName = graphKey !== null ? `${graphKey}.${key}` : key;
        prev[key] = Parameter.new(parameterName, value);
        return prev;
      },
      {}
    );

    return new EntityParameter(value, transformationRules);
  }

  private readonly value: Value;
  private readonly transformationRules: TransformationRules;

  constructor(value: Value, transformationRules: TransformationRules) {
    this.transformationRules = transformationRules;
    this.value = value;
  }

  toParameter(): ParameterizedEntityParameter {
    return Object.entries(this.value).reduce(
      (
        prev: ParameterizedEntityParameter,
        [key, parameter]: [string, Parameter]
      ) => {
        prev[key] = parameter.get$name();
        return prev;
      },
      {}
    );
  }

  parameterize(): PlainEntityParameter {
    return Object.entries(this.value).reduce(
      (prev: PlainEntityParameter, [key, parameter]: [string, Parameter]) => {
        const transformationRule = this.transformationRules.get(
          parameter.getPropertyName()
        );
        if (transformationRule) {
          prev[key] = transformationRule.parameterize(parameter.getValue());
        } else {
          prev[key] = parameter.getValue();
        }
        return prev;
      },
      {}
    );
  }
}
