import neo4j from 'neo4j-driver';
import * as process from 'process';
import { configure } from '../../../src';
import { deleteConfig } from '../../../src/api/configure';

describe('configure', () => {
  afterEach(() => {
    deleteConfig();
    delete process.env.SPINEL_HOST;
    delete process.env.SPINEL_USER;
    delete process.env.SPINEL_PASSWORD;
  });

  test('create with connection setting', () => {
    expect(() => {
      configure({
        host: 'neo4j://example.com',
        password: 'pass',
        user: 'neo4j',
        entities: [],
      });
    }).not.toThrowError();
  });

  test('create with Env vars', () => {
    process.env.SPINEL_HOST = 'neo4j://example.com';
    process.env.SPINEL_USER = 'neo4j';
    process.env.SPINEL_PASSWORD = 'pass';

    expect(() => {
      configure({
        entities: [],
      });
    }).not.toThrowError();
  });

  test('if none of the setting, Driver, or Env vars are provided, throw Error', () => {
    expect(() => {
      configure({
        entities: [],
      });
    }).toThrowError(
      'Insufficient setting error: environment variable "SPINEL_HOST" is not defined.'
    );
  });
});
