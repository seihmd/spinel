import neo4j from 'neo4j-driver';
import { newRepository } from '../../../src';

process.env.SPINEL_HOST = 'neo4j://localhost';
process.env.SPINEL_USER = 'neo4j';
process.env.SPINEL_PASSWORD = 'password';

describe('newRepository', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterAll(() => {
    process.env = env; // Restore old environment
  });

  test('with env vars', () => {
    expect(() => {
      newRepository();
    }).not.toThrowError();
  });

  test('with setting', () => {
    expect(() => {
      newRepository({
        host: 'neo4j://localhost',
        user: 'neo4j',
        password: 'password',
      });
    }).not.toThrowError();
  });

  test('with Driver', () => {
    const driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', 'password'));
  })
});
