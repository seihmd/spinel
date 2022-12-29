import { NodeLabel } from '../../../node/NodeLabel';
import { EntityNotionTerm, LABEL_PREFIX } from './EntityNotionTerm';

export class NodeLabelTerm extends EntityNotionTerm {
  static maybe(value: string): boolean {
    return value.startsWith('(');
  }

  static withNodeLabel(label: NodeLabel, alias = ''): NodeLabelTerm {
    return new NodeLabelTerm(`(${alias}:${label.toString()})`);
  }

  private readonly alias: string | null = null;
  private readonly label: string | null = null;

  constructor(value: string) {
    super(value);

    if (value === '' || !/^\((\w+)?(:\w+)?\)$/.test(value)) {
      this.throwInvalidValueError();
    }

    const body = this.value.slice(1, -1);
    if (body === '') {
      return;
    }

    const elms = body.split(LABEL_PREFIX);
    this.alias = elms[0] !== '' ? elms[0] : null;
    this.label = elms[1] ?? null;
  }

  getLabel(): string | null {
    return this.label;
  }

  getAlias(): string | null {
    return this.alias;
  }
}
