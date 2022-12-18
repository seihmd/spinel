import { Driver } from 'neo4j-driver';
import TransactionPromise from 'neo4j-driver-core/types/transaction-promise';
import { Direction } from '../../domain/graph/Direction';
import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { FindQueryBuilder } from '../builder/find/FindQueryBuilder';
import { FindOneQueryBuilder } from '../builder/findOne/FindOneQueryBuilder';
import { QueryBuilder } from '../builder/QueryBuilder';
import { SessionProvider } from './SessionProvider';
import { SessionProviderInterface } from './SessionProviderInterface';
import { TransactionalSessionProvider } from './TransactionalSessionProvider';

type Instance = InstanceType<ClassConstructor<object>>;

export class QueryDriver {
  private readonly driver: Driver;
  private readonly txc: TransactionPromise | null;

  constructor(driver: Driver, txc: TransactionPromise | null = null) {
    this.driver = driver;
    this.txc = txc;
  }

  builder(): QueryBuilder {
    return new QueryBuilder(this.sessionProvider());
  }

  find<T>(cstr: ClassConstructor<T>): FindQueryBuilder<T> {
    return this.builder().find(cstr);
  }

  findOne<T>(cstr: ClassConstructor<T>): FindOneQueryBuilder<T> {
    return this.builder().findOne(cstr);
  }

  async save(instance: Instance): Promise<void> {
    await this.builder().save(instance).run();
  }

  async delete(instance: Instance): Promise<void> {
    await this.builder().delete(instance).run();
  }

  async detach(
    node1: Instance,
    node2: Instance,
    relationship?: string | ClassConstructor<object>,
    direction?: Direction
  ): Promise<void> {
    await this.builder().detach(node1, node2, relationship, direction).run();
  }

  async detachDelete(instance: Instance): Promise<void> {
    await this.builder().detachDelete(instance).run();
  }

  async transactional(callback: (api: QueryDriver) => Promise<void>) {
    const session = this.driver.session();
    const txc = session.beginTransaction();
    try {
      await callback(new QueryDriver(this.driver, txc));
    } catch (error) {
      await txc?.rollback();
      return;
    }
    await txc.commit();
  }

  private sessionProvider(): SessionProviderInterface {
    if (this.txc) {
      return new TransactionalSessionProvider(this.txc);
    }

    return new SessionProvider(this.driver);
  }
}
