import neo4j, { Driver } from 'neo4j-driver';
import 'reflect-metadata';
import { QueryDriver } from '../query/driver/QueryDriver';
import { Config } from './Config';

export const getQueryDriver = (): QueryDriver => {
  return new QueryDriver(newDriver());
};

function newDriver(): Driver {
  const config = Config.readConfig();
  if (!config) {
    throw new Error('Spinel is not yet configured.');
  }

  return neo4j.driver(
    config.host,
    neo4j.auth.basic(config.user, config.password)
  );
}
