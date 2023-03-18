import { getQueryDriver } from '../../../src';
import { Config } from '../../../src/api/Config';

describe('getQueryDriver', () => {
  afterEach(() => {
    Config.deleteConfig();
  });

  test('create with setting', () => {
    Config.configure({
      entities: [],
      host: 'neo4j://localhost',
      password: 'pass',
      user: 'neo4j',
    });
    expect(() => {
      getQueryDriver();
    }).not.toThrowError();
  });

  test('if not yet configured, throw Error', () => {
    expect(() => {
      getQueryDriver();
    }).toThrowError('spinel is not configured.');
  });
});
