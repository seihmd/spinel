import { IndexType } from './IndexType';
import { NodeLabel } from '../node/NodeLabel';
import { AbstractIndex } from './AbstractIndex';

export class TextIndex extends AbstractIndex {
  getIndexType(): IndexType {
    return 'text';
  }

  getAutogeneratedName() {
    const keys = this.on.sort().join('_');

    return `SPNL_i_${
      this.labelOrType instanceof NodeLabel ? 'n' : 'r'
    }_t_${this.labelOrType.toString()}_${keys}`;
  }
}
