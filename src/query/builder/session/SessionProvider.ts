import { Driver } from 'neo4j-driver';
import { SessionInterface } from './SessionInterface';
import { SessionProviderInterface } from './SessionProviderInterface';

export class SessionProvider implements SessionProviderInterface {
  private readonly driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  get(): SessionInterface {
    return this.driver.session();
  }
}
