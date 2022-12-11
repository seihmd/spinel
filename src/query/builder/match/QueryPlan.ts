import { toInstance } from 'util/toInstance';
import { Depth } from '../../../domain/graph/branch/Depth';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { OrderByQueries } from '../orderBy/OrderByQueries';
import { SessionInterface } from '../session/SessionInterface';
import { WhereQueries } from '../where/WhereQueries';
import { QueryBuilder } from './QueryBuilder';

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
  static new(session: SessionInterface): QueryPlan {
    return new QueryPlan(QueryBuilder.new(), getMetadataStore(), session);
  }

  private readonly queryBuilder: QueryBuilder;
  private readonly metadataStore: MetadataStoreInterface;
  private readonly session: SessionInterface;

  constructor(
    queryBuilder: QueryBuilder,
    metadataStore: MetadataStoreInterface,
    session: SessionInterface
  ) {
    this.metadataStore = metadataStore;
    this.queryBuilder = queryBuilder;
    this.session = session;
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
    const result = await this.session.run(q, completeOption.parameters);

    return result.records.map((record) => {
      return toInstance(cstr, record.toObject()['_']);
    });
  }
}
