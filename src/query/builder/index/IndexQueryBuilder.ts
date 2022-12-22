import { IndexInterface } from '../../../domain/index/IndexInterface';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { CreateIndexQuery } from './CreateIndexQuery';
import { CreateIndexStatement } from './CreateIndexStatement';
import { DropIndexQuery } from './DropIndexQuery';
import { DropIndexStatement } from './DropIndexStatement';

export class IndexQueryBuilder {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly indexes: IndexInterface[],
    private readonly existingIndexNames: string[]
  ) {}

  buildCreateQueries(): CreateIndexQuery[] {
    return this.indexes
      .filter((index) => !this.existingIndexNames.includes(index.getName()))
      .map(
        (index) =>
          new CreateIndexQuery(
            this.sessionProvider,
            new CreateIndexStatement(index)
          )
      );
  }

  buildDropQueries(): DropIndexQuery[] {
    const indexNames = this.indexes.map((index) => index.getName());
    return this.existingIndexNames
      .filter((indexName) => !indexNames.includes(indexName))
      .map(
        (indexName) =>
          new DropIndexQuery(
            this.sessionProvider,
            new DropIndexStatement(indexName)
          )
      );
  }
}
