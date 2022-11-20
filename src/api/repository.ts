import 'reflect-metadata';
import neo4j, { Driver } from 'neo4j-driver';
import { QueryPlan } from '../query/builder/match/QueryPlan';
import { WhereQueries } from '../query/builder/where/WhereQueries';
import { OrderByQueries } from '../query/builder/orderBy/OrderByQueries';
import { FindQuery } from './query';
import { SaveQueryPlan } from '../query/builder/save/SaveQueryPlan';
import * as process from 'process';
import { ENV_SPINEL_HOST, ENV_SPINEL_PASSWORD, ENV_SPINEL_USER } from './env';
import { UndefinedSettingError } from './errors';

export interface SpinelRepositoryInterface {
  find<T>(query: FindQuery<T>): Promise<T[]>;

  findOne<T>(query: FindQuery<T>): Promise<T | null>;

  save(nodeOrGraph: object): Promise<void>;

  getDriver(): Driver;
}

class SpinelRepository implements SpinelRepositoryInterface {
  private readonly driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  getDriver(): Driver {
    return this.driver;
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

type DriverSetting = {
  host: string;
  user: string;
  password: string;
};

export const newRepository = (
  settingOrDriver: DriverSetting | Driver | null = null
): SpinelRepositoryInterface => {
  return new SpinelRepository(newDriver(settingOrDriver));
};

function newDriver(
  settingOrDriver: DriverSetting | Driver | null = null
): Driver {
  if (settingOrDriver === null) {
    return newDriverWithEnvVars();
  }
  if ('rxSession' in settingOrDriver) {
    return settingOrDriver;
  }

  return newDriverWithSetting(settingOrDriver);
}

function newDriverWithEnvVars(): Driver {
  const host = process.env[ENV_SPINEL_HOST];
  const user = process.env[ENV_SPINEL_USER];
  const password = process.env[ENV_SPINEL_PASSWORD];

  if (host === undefined) {
    throw new UndefinedSettingError(ENV_SPINEL_HOST);
  }

  if (user === undefined) {
    throw new UndefinedSettingError(ENV_SPINEL_USER);
  }

  if (password === undefined) {
    throw new UndefinedSettingError(ENV_SPINEL_PASSWORD);
  }

  return neo4j.driver(host, neo4j.auth.basic(user, password));
}

function newDriverWithSetting(setting: DriverSetting): Driver {
  return neo4j.driver(
    setting.host,
    neo4j.auth.basic(setting.user, setting.password)
  );
}
