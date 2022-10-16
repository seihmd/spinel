import { Driver } from 'neo4j-driver';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { IndexQueryBuilder } from './IndexQueryBuilder';

export class IndexQueryPlan {
  static new(driver: Driver): IndexQueryPlan {
    return new IndexQueryPlan(getMetadataStore(), driver);
  }

  private readonly metadataStore: MetadataStoreInterface;
  private readonly driver: Driver;

  constructor(metadataStore: MetadataStoreInterface, driver: Driver) {
    this.metadataStore = metadataStore;
    this.driver = driver;
  }

  async exec(shouldCreate = true, shouldDrop = true) {
    if (!shouldCreate && !shouldDrop) {
      throw new Error();
    }

    const queryBuilder = new IndexQueryBuilder(
      this.metadataStore.getAllIndexes(),
      await this.readExisting()
    );

    const session = this.driver.session({ defaultAccessMode: 'WRITE' });
    await session.executeWrite(async (txc) => {
      if (shouldDrop) {
        await Promise.all(
          queryBuilder
            .getDropClauses()
            .map(
              async (dropIndexClause) => await txc.run(dropIndexClause.get())
            )
        );
      }
      if (shouldCreate) {
        await Promise.all(
          queryBuilder
            .getCreateClauses()
            .map(
              async (createIndexClause) =>
                await txc.run(createIndexClause.get())
            )
        );
      }
    });
  }

  private async readExisting(): Promise<string[]> {
    const result = await this.driver.session().run('SHOW INDEXES');
    return result.records.map(
      (result) => (result.toObject() as { name: string }).name
    );
  }
}
