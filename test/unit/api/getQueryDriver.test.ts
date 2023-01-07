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
      getQueryDriver();
    }).not.toThrowError();
  });

  test('if not yet initialized, throw Error', () => {
    expect(() => {
      getQueryDriver();
    }).toThrowError('Not initialized.');
  });
});
