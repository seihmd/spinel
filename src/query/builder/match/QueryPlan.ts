import { Driver } from 'neo4j-driver';
import { QueryBuilder } from './QueryBuilder';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { Depth } from '../../../domain/graph/branch/Depth';
import { WhereQueries } from '../where/WhereQueries';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { toInstance } from 'util/toInstance';

export class QueryPlan {
  static new(driver: Driver): QueryPlan {
    return new QueryPlan(QueryBuilder.new(), getMetadataStore(), driver);
  }

  private readonly queryBuilder: QueryBuilder;
  private readonly metadataStore: MetadataStoreInterface;
  private readonly driver: Driver;

  constructor(
    queryBuilder: QueryBuilder,
    metadataStore: MetadataStoreInterface,
    driver: Driver
  ) {
    this.metadataStore = metadataStore;
    this.queryBuilder = queryBuilder;
    this.driver = driver;
  }

  async execute<T>(
    cstr: ClassConstructor<T>,
    whereQueries: WhereQueries,
    depth: Depth = Depth.withDefault(),
    parameters: unknown = {}
  ): Promise<T[]> {
    const query = this.queryBuilder.build(cstr, whereQueries, depth);

    const q = query.get('_');
    const result = await this.driver.session().run(q, parameters);

    return result.records.map((record) => {
      return toInstance(cstr, record.toObject()['_']);
    });
  }
}
