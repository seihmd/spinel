import { GraphParameterEntry } from './GraphParameterEntry';
import { GraphParameterKey } from './GraphParameterKey';
import { GraphParameterType } from './ParameterType';
import { EntityParameter } from './EntityParameter';
import { merge } from 'lodash';

export class GraphParameter {
  private readonly entries: GraphParameterEntry[];
  private readonly root: string;

  constructor(root: string, value: GraphParameterType) {
    this.root = root;
    this.entries = Object.entries(value).map(
      ([k, v]) => new GraphParameterEntry(new GraphParameterKey(k), v)
    );
  }

  asPlain(): GraphParameterType {
    return this.entries.reduce(
      (prev: GraphParameterType, current: GraphParameterEntry) => {
        return merge(prev, current.asPlain());
      },
      {}
    );
  }

  getRoot(): string {
    return this.root;
  }

  of(key: string): GraphParameter {
    const params = this.entries.reduce(
      (prev: GraphParameterType, current: GraphParameterEntry) => {
        const rootKey = current.getRoot();
        if (rootKey !== key) {
          return prev;
        }
        prev[current.getKey()] = current.getValue();

        return prev;
      },
      {}
    );

    const newRoot = this.root === '' ? key : `${this.root}.${key}`;
    return new GraphParameter(newRoot, params);
  }

  get(key: string): EntityParameter {
    const keyWithRoot = this.root === '' ? key : this.root + '.' + key;
    for (const entry of this.entries) {
      if (entry.getKey() === keyWithRoot) {
        return new EntityParameter(entry.getValue());
      }
    }

    return new EntityParameter({});
  }
}
