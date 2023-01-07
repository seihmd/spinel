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

type Config = Required<ArbitraryConfig>;

let config: Config | null = null;

export function readConfig(): Config | null {
  return config;
}

export function deleteConfig(): void {
  config = null;
}

export function configure(setting: ArbitraryConfig) {
  if (config) {
    throw new Error('Already configured');
  }
  config = Object.freeze({
    entities: setting.entities,
    host: setting.host ?? readHost(ENV_SPINEL_HOST),
    password: setting.password ?? readPassword(ENV_SPINEL_PASSWORD),
    user: setting.user ?? readUser(ENV_SPINEL_USER),
  });
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
