import { EntityTerm } from './EntityTerm';

export class AssociationReferenceTerm extends EntityTerm {
  static maybe(value: string): boolean {
    return value.startsWith('.');
  }

  constructor(value: string) {
    super(value);

    if (!/^\.\w*$/.test(value)) {
      this.throwInvalidValueError();
    }
  }

  getKey(): string {
    return this.value.substring(1);
  }
}
