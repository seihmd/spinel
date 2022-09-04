import { Record as Neo4jRecord } from 'neo4j-driver-core';
import { Driver } from 'neo4j-driver';
import { QueryBuilder } from './QueryBuilder';
import { StemBuilder } from './StemBuilder';
import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../metadata/store/MetadataStoreInterface';
import { Depth } from '../../domain/graph/branch/Depth';
import { WhereQueries } from './where/WhereQueries';
import { toInstance } from '../../util/toInstance';
import { getMetadataStore } from '../../metadata/store/MetadataStore';

export class QueryPlan {
  static new(driver: Driver): QueryPlan {
    return new QueryPlan(
      new QueryBuilder(StemBuilder.new()),
      getMetadataStore(),
      driver
    );
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
    graphCstr: ClassConstructor<T>,
    whereQueries: WhereQueries,
    depth: Depth = Depth.withDefault(),
    parameters: unknown = {}
  ): Promise<T[]> {
    this.driver.session().beginTransaction();

    const graphMetadata = this.metadataStore.getGraphMetadata(graphCstr);
    const query = this.queryBuilder.build(
      graphMetadata.getCstr(),
      whereQueries,
      depth
    );

    const q = query.get('_');
    const result = await this.driver.session().run(q, parameters);

    return result.records.map((record) => {
      return this.create(graphCstr, record);
    });
  }

  private create<T>(graphCstr: ClassConstructor<T>, record: Neo4jRecord): T {
    const plain = record.toObject()['_'] as { [key: string]: unknown };
    return toInstance(graphCstr, plain);
  }
}
