import { EntityParameter } from './EntityParameter';

type Value = { [key: string]: EntityParameter };
type Schema<T> = { [p: string]: { [p: string]: T } };
export type PlainGraphParameter = Schema<unknown>;
export type ParameterizedGraphParameter = Schema<string>;

export class GraphParameter {
  static withPlain(plain: PlainGraphParameter): GraphParameter {
    const value = Object.entries(plain).reduce(
      (
        prev: Value,
        [graphKey, plainProperties]: [string, { [key: string]: unknown }]
      ) => {
        prev[graphKey] = EntityParameter.withPlain(plainProperties, graphKey);
        return prev;
      },
      {}
    );

    return new GraphParameter(value);
  }

  private readonly value: Value;

  constructor(value: Value) {
    this.value = value;
  }

  getEntityParameter(key: string): EntityParameter | null {
    return this.value[key] ?? null;
  }

  toParameter(): Schema<string> {
    return Object.entries(this.value).reduce(
      (
        prev: Schema<string>,
        [key, entityParameter]: [string, EntityParameter]
      ) => {
        prev[key] = entityParameter.toParameter();
        return prev;
      },
      {}
    );
  }

  toPlain(): Schema<unknown> {
    return Object.entries(this.value).reduce(
      (
        prev: Schema<unknown>,
        [key, entityParameter]: [string, EntityParameter]
      ) => {
        prev[key] = entityParameter.toPlain();
        return prev;
      },
      {}
    );
  }
}
