import { Driver } from 'neo4j-driver';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { DropConstraintClause } from '../../constraint/DropConstraintClause';
import { CreateConstraintClause } from '../../constraint/CreateConstraintClause';
import { ConstraintData } from '../../constraint/ConstraintData';
import { ConstraintList } from '../../constraint/ConstraintList';
import { ConstraintInterface } from '../../constraint/ConstraintInterface';

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
    const [toCreates, toDrops] = await this.diff();

    const dropQueries = toDrops.map((constraintName) =>
      new DropConstraintClause(constraintName).get()
    );

    const createQueries = toCreates.map((constraint) =>
      new CreateConstraintClause(constraint).get()
    );

    const session = this.driver.session({ defaultAccessMode: 'WRITE' });
    await session.executeWrite(async (txc) => {
      if (shouldDrop) {
        await Promise.all(dropQueries.map(async (q) => await txc.run(q)));
      }
      if (shouldCreate) {
        await Promise.all(createQueries.map(async (q) => await txc.run(q)));
      }
    });
  }

  private async diff(): Promise<[ConstraintInterface[], string[]]> {
    const allConstraints = this.metadataStore.getAllConstraints();
    const constraintList = new ConstraintList(
      allConstraints.reduce((prev: ConstraintInterface[], constraints) => {
        prev.push(...constraints.getAll());
        return prev;
      }, [])
    );

    return constraintList.diff(await this.readExisting());
  }

  private async readExisting(): Promise<ConstraintData[]> {
    const result = await this.driver.session().run('SHOW CONSTRAINTS');
    return result.records.map((result) => result.toObject() as ConstraintData);
  }
}
