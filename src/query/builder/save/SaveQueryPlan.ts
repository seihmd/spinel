import { Driver } from 'neo4j-driver';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { SaveQueryBuilder } from './SaveQueryBuilder';

export class SaveQueryPlan {
  static new(driver: Driver): SaveQueryPlan {
    return new SaveQueryPlan(
      SaveQueryBuilder.new(),
      getMetadataStore(),
      driver
    );
  }

  private readonly queryBuilder: SaveQueryBuilder;
  private readonly metadataStore: MetadataStoreInterface;
  private readonly driver: Driver;

  constructor(
    queryBuilder: SaveQueryBuilder,
    metadataStore: MetadataStoreInterface,
    driver: Driver
  ) {
    this.metadataStore = metadataStore;
    this.queryBuilder = queryBuilder;
    this.driver = driver;
  }

  async execute(instance: object): Promise<void> {
    this.driver.session().beginTransaction();
    const [query, parameterBag] = this.queryBuilder.build(instance);

    await this.driver.session().run(query.get(), parameterBag.toPlain());
  }
}
