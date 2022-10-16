import { NodeLabel } from '../../../domain/node/NodeLabel';
import { IndexInterface } from '../../../domain/index/IndexInterface';
import { FullTextIndex } from '../../../domain/index/FullTextIndex';

export class CreateIndexClause {
  private index: IndexInterface;

  constructor(index: IndexInterface) {
    this.index = index;
  }

  get(): string {
    return (
      `CREATE${this.getType()} INDEX ` +
      `${this.getName()} ` +
      `IF NOT EXISTS FOR ${this.getPattern()} ` +
      `ON ${this.getProperties()}` +
      this.getOptions()
    );
  }

  private getType(): string {
    if (this.index.getIndexType() === 'btree') {
      return '';
    }

    return ' ' + this.index.getIndexType();
  }

  private getName(): string {
    return this.index.getName();
  }

  private getPattern(): string {
    if (this.index.getLabelOrType() instanceof NodeLabel) {
      return `(e:${this.index.getLabelOrType().toString()})`;
    }
    return `()-[e:${this.index.getLabelOrType().toString()}]-()`;
  }

  private getProperties(): string {
    const keys = this.index
      .getProperties()
      .map((p) => `e.${p}`)
      .join(', ');

    if (this.index instanceof FullTextIndex) {
      return `EACH [${keys}]`;
    }
    return `(${keys})`;
  }

  private getOptions(): string {
    const options = this.index.getOptions();
    if (options === null) {
      return '';
    }

    return ` OPTIONS ${options}`;
  }
}
