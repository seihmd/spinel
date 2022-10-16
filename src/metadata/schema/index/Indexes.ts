import { IndexType } from '../../../domain/index/IndexType';
import { IndexInterface } from '../../../domain/index/IndexInterface';
import { BtreeIndex } from '../../../domain/index/BtreeIndex';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { TextIndex } from '../../../domain/index/TextIndex';
import { FullTextIndex } from '../../../domain/index/FullTextIndex';
import { Properties } from '../entity/Properties';

export class Indexes {
  private readonly indexes: IndexInterface[];

  static new(
    labelOrType: NodeLabel | RelationshipType,
    values: {
      name?: string;
      type: IndexType;
      on: string[];
      options?: string;
    }[],
    properties: Properties
  ): Indexes {
    return new Indexes(
      values.map((value) => {
        if (value.type === 'btree') {
          return new BtreeIndex(
            labelOrType,
            value.on.map((property) => properties.toNeo4jKey(property)),
            value.options ?? null,
            value.name ?? null
          );
        }
        if (value.type === 'text') {
          return new TextIndex(
            labelOrType,
            value.on.map((property) => properties.toNeo4jKey(property)),
            value.options ?? null,
            value.name ?? null
          );
        }
        if (value.type === 'fulltext') {
          return new FullTextIndex(
            labelOrType,
            value.on.map((property) => properties.toNeo4jKey(property)),
            value.options ?? null,
            value.name ?? null
          );
        }

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Unsupported index type: "${value.type}"`);
      })
    );
  }

  constructor(indexes: IndexInterface[]) {
    this.indexes = indexes;
  }

  getAll(): IndexInterface[] {
    return this.indexes;
  }
}
