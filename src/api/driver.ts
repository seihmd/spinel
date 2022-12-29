import neo4j, { Driver } from 'neo4j-driver';
import * as process from 'process';
import 'reflect-metadata';
import { QueryDriver } from '../query/driver/QueryDriver';
import { ENV_SPINEL_HOST, ENV_SPINEL_PASSWORD, ENV_SPINEL_USER } from './env';
import { UndefinedSettingError } from './errors';

type DriverSetting = {
  host: string;
  user: string;
  password: string;
};

export const getQueryDriver = (
  settingOrDriver: DriverSetting | Driver | null = null
): QueryDriver => {
  return new QueryDriver(newDriver(settingOrDriver));
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
