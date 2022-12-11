import { Driver } from 'neo4j-driver';
import { Direction } from '../../domain/graph/Direction';
import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../metadata/store/MetadataStoreInterface';
import { DeleteQuery } from './delete/DeleteQuery';
import { DeleteQueryBuilder } from './delete/DeleteQueryBuilder';
import { DetachQuery } from './detach/DetachQuery';
import { DetachQueryBuilder } from './detach/DetachQueryBuilder';
import { DetachDeleteQuery } from './detachDelete/DetachDeleteQuery';
import { DetachDeleteQueryBuilder } from './detachDelete/DetachDeleteQueryBuilder';
import { FindQueryBuilder } from './find/FindQueryBuilder';
import { SaveQuery } from './save/SaveQuery';
import { SaveQueryBuilder } from './save/SaveQueryBuilder';
import { SessionProvider } from './session/SessionProvider';
import { SessionProviderInterface } from './session/SessionProviderInterface';

type Instance = InstanceType<ClassConstructor<object>>;

export class QueryBuilder {
  private readonly driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  find<T>(cstr: ClassConstructor<T>, alias: string): FindQueryBuilder<T> {
    return new FindQueryBuilder<T>(
      this.sessionProvider(),
      this.metadataStore(),
      cstr,
      alias
    );
  }

  save(instance: Instance): SaveQuery {
    return new SaveQueryBuilder(
      this.sessionProvider(),
      this.metadataStore(),
      instance
    ).buildQuery();
  }

  delete(instance: Instance): DeleteQuery {
    return new DeleteQueryBuilder(
      this.sessionProvider(),
      this.metadataStore(),
      instance
    ).buildQuery();
  }

  detach(
    node1: Instance,
    node2: Instance,
    relationship?: string | ClassConstructor<object>,
    direction?: Direction
  ): DetachQuery {
    return new DetachQueryBuilder(
      this.sessionProvider(),
      this.metadataStore(),
      node1,
      node2,
      relationship,
      direction
    ).buildQuery();
  }

  detachDelete(instance: Instance): DetachDeleteQuery {
    return new DetachDeleteQueryBuilder(
      this.sessionProvider(),
      this.metadataStore(),
      instance
    ).buildQuery();
  }

  private sessionProvider(): SessionProviderInterface {
    return new SessionProvider(this.driver);
  }

  private metadataStore(): MetadataStoreInterface {
    return getMetadataStore();
  }
}
