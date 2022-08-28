import { plainToInstance } from 'class-transformer';
import { Record as Neo4jRecord } from 'neo4j-driver-core';
import { Driver } from 'neo4j-driver';
import { QueryBuilder } from './QueryBuilder';
import { GraphParameter } from '../parameter/GraphParameter';
import { GraphParameterType } from '../parameter/ParameterType';
import { StemBuilder } from './StemBuilder';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../metadata/store/MetadataStoreInterface';
import { Depth } from '../../domain/graph/branch/Depth';
import { WhereQueries } from './where/WhereQueries';

export class QueryPlan {
  static new(driver: Driver): QueryPlan {
    const metadataStore = getMetadataStore();
    return new QueryPlan(
      new QueryBuilder(new StemBuilder(metadataStore)),
      metadataStore,
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
    graphParameterType: GraphParameterType,
    depth: Depth = Depth.withDefault()
  ): Promise<T[]> {
    this.driver.session().beginTransaction();

    const graphMetadata = this.metadataStore.getGraphMetadata(graphCstr);
    const graphParameter = new GraphParameter('', graphParameterType);
    const query = this.queryBuilder.build(
      graphMetadata.getCstr(),
      whereQueries,
      graphParameter,
      depth
    );

    const q = query.get('_');
    const result = await this.driver.session().run(q, graphParameter.asPlain());

    return result.records.map((record) => {
      return this.create(graphCstr, record);
    });
  }

  private create<T>(graphCstr: ClassConstructor<T>, record: Neo4jRecord): T {
    const plain = record.toObject()['_'] as { [key: string]: unknown };
    return plainToInstance(graphCstr, plain, {
      excludeExtraneousValues: true,
    });
  }
}
