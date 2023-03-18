import process from 'process';
import { ClassConstructor } from '../domain/type/ClassConstructor';
import { ENV_SPINEL_HOST, ENV_SPINEL_PASSWORD, ENV_SPINEL_USER } from './env';
import { UndefinedSettingError } from './errors';

type ArbitraryConfig = {
  host?: string;
  user?: string;
  password?: string;
  entities: ClassConstructor<any>[];
};

export class Config {
  private static config: Required<ArbitraryConfig> | null;

  private constructor() {
    // do nothing
  }

  static configure(setting: ArbitraryConfig) {
    if (!Config.config) {
      Config.config = Object.freeze({
        entities: setting.entities,
        host: setting.host ?? readHost(ENV_SPINEL_HOST),
        password: setting.password ?? readPassword(ENV_SPINEL_PASSWORD),
        user: setting.user ?? readUser(ENV_SPINEL_USER),
      });
    }
    return Config.config;
  }

  static deleteConfig() {
    Config.config = null;
  }

  static readConfig() {
    if (!Config.config) {
      throw new Error('spinel is not configured.');
    }
    return Config.config;
  }
}

function readHost(env: string): string {
  const value = process.env.SPINEL_HOST;
  if (value === undefined) {
    throw new UndefinedSettingError(env);
  }

  return value;
}

function readPassword(env: string): string {
  const value = process.env.SPINEL_PASSWORD;
  if (value === undefined) {
    throw new UndefinedSettingError(env);
  }

  return value;
}

function readUser(env: string): string {
  const value = process.env.SPINEL_USER;
  if (value === undefined) {
    throw new UndefinedSettingError(env);
  }

  return value;
}
