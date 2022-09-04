import { Parameter } from './Parameter';

type Value = { [key: string]: Parameter };
type Schema<T> = { [key: string]: T };
export type PlainEntityParameter = Schema<unknown>;
export type ParameterizedEntityParameter = Schema<string>;

export class EntityParameter {
  static withPlain(
    plain: PlainEntityParameter,
    graphKey: string | null
  ): EntityParameter {
    const value = Object.entries(plain).reduce(
      (prev: Value, [key, value]: [string, unknown]) => {
        const parameterName = graphKey !== null ? `${graphKey}.${key}` : key;
        prev[key] = Parameter.new(parameterName, value);
        return prev;
      },
      {}
    );

    return new EntityParameter(value);
  }

  private readonly value: Value;

  constructor(value: Value) {
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

  toPlain(): PlainEntityParameter {
    return Object.entries(this.value).reduce(
      (prev: PlainEntityParameter, [key, parameter]: [string, Parameter]) => {
        prev[key] = parameter.getValue();
        return prev;
      },
      {}
    );
  }
}
