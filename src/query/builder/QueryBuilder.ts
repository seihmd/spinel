import { Driver } from 'neo4j-driver';
import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { FindQueryBuilder } from './FindQueryBuilder';
import { SessionInterface } from './SessionInterface';

export class QueryBuilder {
  private readonly driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  find<S>(cstr: ClassConstructor<S>, alias: string): FindQueryBuilder<S> {
    return new FindQueryBuilder<S>(this.session(), cstr, alias);
  }

  private session(): SessionInterface {
    return this.driver.session();
  }
}
