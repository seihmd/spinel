import { Driver } from 'neo4j-driver';
import { QueryBuilder } from './QueryBuilder';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { Depth } from '../../../domain/graph/branch/Depth';
import { WhereQueries } from '../where/WhereQueries';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { toInstance } from 'util/toInstance';
import { OrderByQueries } from '../orderBy/OrderByQueries';

type MatchQueryPlanOption = {
  whereQueries: WhereQueries;
  orderByQueries: OrderByQueries;
  depth: Depth;
  parameters: unknown;
};

const defaultOption: MatchQueryPlanOption = {
  whereQueries: new WhereQueries([]),
  orderByQueries: new OrderByQueries([]),
  depth: Depth.withDefault(),
  parameters: {},
};

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
    option: Partial<MatchQueryPlanOption>
  ): Promise<T[]> {
    const completeOption = Object.assign(
      defaultOption,
      option
    ) as MatchQueryPlanOption;
    const query = this.queryBuilder.build(
      cstr,
      completeOption.whereQueries,
      completeOption.orderByQueries,
      completeOption.depth
    );

    const q = query.get('_');
    const result = await this.driver
      .session()
      .run(q, completeOption.parameters);

    return result.records.map((record) => {
      return toInstance(cstr, record.toObject()['_']);
    });
  }
}
