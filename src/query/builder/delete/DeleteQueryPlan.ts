import { Driver } from 'neo4j-driver';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { DeleteQueryBuilder } from './DeleteQueryBuilder';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';

export class DeleteQueryPlan {
  static new(driver: Driver): DeleteQueryPlan {
    return new DeleteQueryPlan(
      new DeleteQueryBuilder(getMetadataStore()),
      driver
    );
  }

  private readonly deleteQueryBuilder: DeleteQueryBuilder;
  private readonly driver: Driver;

  constructor(deleteQueryBuilder: DeleteQueryBuilder, driver: Driver) {
    this.deleteQueryBuilder = deleteQueryBuilder;
    this.driver = driver;
  }

  async execute(
    instance: InstanceType<ClassConstructor<object>>,
    detach: boolean
  ): Promise<void> {
    const query = this.deleteQueryBuilder.build(instance, detach);

    await this.driver.session().run(query.get());
  }
}
