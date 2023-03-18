import { configure, getQueryDriver } from '../../../src';
import { deleteConfig } from '../../../src/api/configure';

describe('getQueryDriver', () => {
  afterEach(() => {
    deleteConfig();
  });

  test('create with setting', () => {
    configure({
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
