import { ReflectedType } from '../../reflection/ReflectedType';

type Type = typeof String | typeof Number;

export class PrimaryType {
  static new(reflectedType: ReflectedType): PrimaryType {
    if (
      reflectedType.getType() !== String &&
      reflectedType.getType() !== Number
    ) {
      throw new Error(
        `Type of Primary ${
          reflectedType.getTarget().constructor.name
        }.${reflectedType.getPropertyKey()} must be string or number`
      );
    }

    return new PrimaryType(
      reflectedType.getPropertyKey(),
      reflectedType.getType() as Type
    );
  }

  private readonly propertyKey: string;
  private readonly type: Type;

  constructor(propertyKey: string, type: Type) {
    this.propertyKey = propertyKey;
    this.type = type;
  }

  getKey(): string {
    return this.propertyKey;
  }

  getType(): Type {
    return this.type;
  }
}
