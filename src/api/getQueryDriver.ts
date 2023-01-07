import neo4j, { Driver } from 'neo4j-driver';
import 'reflect-metadata';
import { QueryDriver } from '../query/driver/QueryDriver';
import { readConfig } from './configure';

export const getQueryDriver = (): QueryDriver => {
  return new QueryDriver(newDriver());
};

function newDriver(): Driver {
  const config = readConfig();
  if (!config) {
    throw new Error('Spinel configuration is not yet initialized.');
  }

  return neo4j.driver(
    config.host,
    neo4j.auth.basic(config.user, config.password)
  );
}
