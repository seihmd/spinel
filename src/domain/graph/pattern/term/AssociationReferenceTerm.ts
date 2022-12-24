import { EntityTerm } from './EntityTerm';

export class AssociationReferenceTerm extends EntityTerm {
  private readonly keys: string[];

  constructor(value: string) {
    super(value);

    if (!/^\w+(\.\w+)*$/.test(value)) {
      this.throwInvalidValueError();
    }

    this.keys = this.value.split('.');
  }

  getKeys(): string[] {
    return this.keys;
  }

  getKey(): string | null {
    return this.keys[-1];
  }
}
