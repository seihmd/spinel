import { RelationshipType } from '../../../relationship/RelationshipType';
import { EntityNotionTerm, LABEL_PREFIX } from './EntityNotionTerm';

export class RelationshipTypeTerm extends EntityNotionTerm {
  static maybe(value: string): boolean {
    return value.startsWith('[');
  }

  static withRelationshipType(
    type: RelationshipType,
    alias = ''
  ): RelationshipTypeTerm {
    return new RelationshipTypeTerm(`[${alias}:${type.toString()}]`);
  }

  private readonly alias: string | null = null;
  private readonly type: string | null = null;

  constructor(value: string) {
    super(value);

    if (value === '' || !/^\[(\w+)?(:\w+)?\]$/.test(value)) {
      this.throwInvalidValueError();
    }

    const body = this.value.slice(1, -1);
    if (body === '') {
      return;
    }

    const elms = body.split(LABEL_PREFIX);
    this.alias = elms[0] !== '' ? elms[0] : null;
    this.type = elms[1] ?? null;
  }

  getType(): string | null {
    return this.type;
  }

  getAlias(): string | null {
    return this.alias;
  }
}
