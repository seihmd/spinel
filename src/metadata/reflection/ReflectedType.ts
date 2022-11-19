export class ReflectedType {
  private readonly propertyKey: string | symbol;
  private readonly target: Object;
  private readonly type: unknown;
  private readonly arrayType: unknown;

  constructor(
    target: Object,
    propertyKey: string | symbol,
    arrayType?: unknown
  ) {
    this.target = target;
    this.propertyKey = propertyKey;

    // eslint-disable-next-line
    this.type = (Reflect as any).getMetadata(
      'design:type',
      target,
      propertyKey
    );

    this.arrayType = arrayType;
  }

  getTarget(): Object {
    return this.target;
  }

  getPropertyKey(): string {
    return this.propertyKey.toString();
  }

  getType(): unknown {
    return this.type;
  }

  isConstructor(): boolean {
    try {
      return (
        typeof this.type === 'function' &&
        this.type.toString().startsWith('class ')
      );
    } catch ($e) {
      return false;
    }
  }

  isArray(): boolean {
    return this.type === Array || this.isExtendedArray();
  }

  isSet(): boolean {
    return this.getType() === Set || this.isExtendedSet();
  }

  private isExtendedArray(): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return typeof this.type === 'function' && Array.isArray(new this.type());
    } catch (e) {
      return false;
    }
  }

  private isExtendedSet(): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new this.type() instanceof Set;
    } catch (e) {
      return false;
    }
  }

  isObject(): boolean {
    return this.type === Object;
  }
}
