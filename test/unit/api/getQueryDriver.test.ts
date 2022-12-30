import neo4j from 'neo4j-driver';
import * as process from 'process';
import { getQueryDriver } from '../../../src';

describe('getQueryDriver', () => {
  afterEach(() => {
    delete process.env.SPINEL_HOST;
    delete process.env.SPINEL_USER;
    delete process.env.SPINEL_PASSWORD;
  });

  test('create with setting', () => {
    expect(() => {
      getQueryDriver({
        host: 'neo4j://example.com',
        password: 'pass',
        user: 'neo4j',
      });
    }).not.toThrowError();
  });

  test('create with Driver', () => {
    expect(() => {
      getQueryDriver(
        neo4j.driver('neo4j://example.com', neo4j.auth.basic('neo4j', 'pass'))
      );
    }).not.toThrowError();
  });

  test('create with Env vars', () => {
    process.env.SPINEL_HOST = 'neo4j://example.com';
    process.env.SPINEL_USER = 'neo4j';
    process.env.SPINEL_PASSWORD = 'pass';

    expect(() => {
      getQueryDriver();
    }).not.toThrowError();
  });

  test('if none of the setting, Driver, or Env vars are provided, throw Error', () => {
    expect(() => {
      getQueryDriver();
    }).toThrowError(
      'Insufficient setting error: environment variable "SPINEL_HOST" is not defined.'
    );
  });
});
