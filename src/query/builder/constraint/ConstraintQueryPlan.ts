import { Driver } from 'neo4j-driver';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { ConstraintQueryBuilder } from './ConstraintQueryBuilder';

export class ConstraintQueryPlan {
  static new(driver: Driver): ConstraintQueryPlan {
    return new ConstraintQueryPlan(getMetadataStore(), driver);
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

    const constraintQueryBuilder = new ConstraintQueryBuilder(
      this.metadataStore.getAllConstraints(),
      await this.readExisting()
    );

    const session = this.driver.session({ defaultAccessMode: 'WRITE' });
    await session.executeWrite(async (txc) => {
      if (shouldDrop) {
        await Promise.all(
          constraintQueryBuilder
            .getDropClauses()
            .map(async (dropClause) => await txc.run(dropClause.get()))
        );
      }
      if (shouldCreate) {
        await Promise.all(
          constraintQueryBuilder
            .getCreateClauses()
            .map(async (createClause) => await txc.run(createClause.get()))
        );
      }
    });
  }

  private async readExisting(): Promise<string[]> {
    const result = await this.driver.session().run('SHOW CONSTRAINTS');
    return result.records.map(
      (result) => (result.toObject() as { name: string }).name
    );
  }
}
