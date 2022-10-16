import { IndexInterface } from '../../../domain/index/IndexInterface';

import { DropIndexClause } from '../../clause/index/DropIndexClause';
import { CreateIndexClause } from '../../clause/index/CreateIndexClause';

export class IndexQueryBuilder {
  private indexes: IndexInterface[];
  private existingIndexNames: string[];

  constructor(indexes: IndexInterface[], existingIndexNames: string[]) {
    this.indexes = indexes;
    this.existingIndexNames = existingIndexNames;
  }

  getCreateClauses(): CreateIndexClause[] {
    return this.indexes
      .filter((index) => !this.existingIndexNames.includes(index.getName()))
      .map((index) => new CreateIndexClause(index));
  }

  getDropClauses(): DropIndexClause[] {
    const indexNames = this.indexes.map((index) => index.getName());
    return this.existingIndexNames
      .filter((indexName) => !indexNames.includes(indexName))
      .map((indexName) => new DropIndexClause(indexName));
  }
}
