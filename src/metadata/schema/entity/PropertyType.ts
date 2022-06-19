import { ReflectedType } from '../../reflection/ReflectedType';

export class PropertyType {
  static new(reflectedType: ReflectedType): PropertyType {
    return new PropertyType(
      reflectedType.getPropertyKey(),
      reflectedType.getType()
    );
  }

  private readonly propertyKey: string;
  private readonly type: unknown;

  constructor(propertyKey: string, type: unknown) {
    this.propertyKey = propertyKey;
    this.type = type;
  }

  getKey(): string {
    return this.propertyKey;
  }

  getType(): unknown {
    return this.type;
  }
}
