import 'reflect-metadata';
import { Driver } from 'neo4j-driver';
import { QueryPlan } from '../query/builder/match/QueryPlan';
import { WhereQueries } from '../query/builder/where/WhereQueries';
import { OrderByQueries } from '../query/builder/orderBy/OrderByQueries';
import { FindQuery } from './query';
import { SaveQueryPlan } from '../query/builder/save/SaveQueryPlan';

let driver: Driver | null = null;

export const initSpinel = (newDriver: Driver) => {
  driver = newDriver;
};

export interface SpinelRepositoryInterface {
  find<T>(query: FindQuery<T>): Promise<T[]>;

  findOne<T>(query: FindQuery<T>): Promise<T | null>;

  save(nodeOrGraph: object): Promise<void>;
}

class SpinelRepository implements SpinelRepositoryInterface {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async find<T>(query: FindQuery<T>): Promise<T[]> {
    const queryPlan = QueryPlan.new(this.driver);

    return await queryPlan.execute(query.getCstr(), {
      whereQueries: new WhereQueries(query.getWhereQueries()),
      orderByQueries: new OrderByQueries(query.getOrderByQueries()),
      parameters: query.getParameters(),
    });
  }

  async findOne<T>(query: FindQuery<T>): Promise<T | null> {
    const queryPlan = QueryPlan.new(this.driver);

    const results = await queryPlan.execute(query.getCstr(), {
      whereQueries: new WhereQueries(query.getWhereQueries()),
      orderByQueries: new OrderByQueries(query.getOrderByQueries()),
      parameters: query.getParameters(),
    });

    if (results.length > 1) {
      throw new Error(`expected 1 result, but found ${results.length} results`);
    }

    return results[0] ?? null;
  }

  async save(nodeOrGraph: object): Promise<void> {
    const queryPlan = SaveQueryPlan.new(this.driver);
    await queryPlan.execute(nodeOrGraph);
  }
}

export const newSpinelRepository = (): SpinelRepositoryInterface => {
  if (!driver) {
    throw new Error('Spinel is not yet initialized');
  }
  return new SpinelRepository(driver);
};
