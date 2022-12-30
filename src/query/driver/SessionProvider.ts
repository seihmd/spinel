import { Driver, QueryResult } from 'neo4j-driver';
import { SessionProviderInterface } from './SessionProviderInterface';

export class SessionProvider implements SessionProviderInterface {
  private readonly driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async run(statement: string, parameters: unknown): Promise<QueryResult> {
    const session = this.driver.session();
    const result = await session.run(statement, parameters);
    await session.close();

    return result;
  }
}
