import { toPlain } from '../../util/toPlain';

export class PlainEntity {
  static withInstance(instance: object): PlainEntity {
    return new PlainEntity(toPlain(instance));
  }

  private readonly value: Record<string, unknown>;

  constructor(value: Record<string, unknown>) {
    this.value = value;
  }

  get(): Record<string, unknown> {
    return this.value;
  }
}
