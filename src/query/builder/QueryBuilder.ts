import { Direction } from '../../domain/graph/Direction';
import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../metadata/store/MetadataStoreInterface';
import { SessionProviderInterface } from '../driver/SessionProviderInterface';
import { ConstraintQueryBuilder } from './constraint/ConstraintQueryBuilder';
import { CreateConstraintQuery } from './constraint/CreateConstraintQuery';
import { DropConstraintQuery } from './constraint/DropConstraintQuery';
import { ShowConstraintsQuery } from './constraint/ShowConstraintsQuery';
import { DeleteQuery } from './delete/DeleteQuery';
import { DeleteQueryBuilder } from './delete/DeleteQueryBuilder';
import { DetachQuery } from './detach/DetachQuery';
import { DetachQueryBuilder } from './detach/DetachQueryBuilder';
import { DetachDeleteQuery } from './detachDelete/DetachDeleteQuery';
import { DetachDeleteQueryBuilder } from './detachDelete/DetachDeleteQueryBuilder';
import { FindQueryBuilder } from './find/FindQueryBuilder';
import { FindOneQueryBuilder } from './findOne/FindOneQueryBuilder';
import { CreateIndexQuery } from './index/CreateIndexQuery';
import { DropIndexQuery } from './index/DropIndexQuery';
import { IndexQueryBuilder } from './index/IndexQueryBuilder';
import { ShowIndexesQuery } from './index/ShowIndexesQuery';
import { SaveQuery } from './save/SaveQuery';
import { SaveQueryBuilder } from './save/SaveQueryBuilder';

type Instance = InstanceType<ClassConstructor<object>>;

export class QueryBuilder {
  private readonly sessionProvider: SessionProviderInterface;

  constructor(sessionProvider: SessionProviderInterface) {
    this.sessionProvider = sessionProvider;
  }

  find<T>(cstr: ClassConstructor<T>): FindQueryBuilder<T> {
    return new FindQueryBuilder<T>(
      this.sessionProvider,
      this.metadataStore(),
      cstr
    );
  }

  findOne<T>(cstr: ClassConstructor<T>): FindOneQueryBuilder<T> {
    return new FindOneQueryBuilder<T>(
      this.sessionProvider,
      this.metadataStore(),
      cstr
    );
  }

  save(instance: Instance): SaveQuery {
    return new SaveQueryBuilder(
      this.sessionProvider,
      this.metadataStore(),
      instance
    ).buildQuery();
  }

  delete(instance: Instance): DeleteQuery {
    return new DeleteQueryBuilder(
      this.sessionProvider,
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
      this.sessionProvider,
      this.metadataStore(),
      node1,
      node2,
      relationship,
      direction
    ).buildQuery();
  }

  detachDelete(instance: Instance): DetachDeleteQuery {
    return new DetachDeleteQueryBuilder(
      this.sessionProvider,
      this.metadataStore(),
      instance
    ).buildQuery();
  }

  showConstraints(): ShowConstraintsQuery {
    return new ShowConstraintsQuery(this.sessionProvider);
  }

  showIndexes(): ShowIndexesQuery {
    return new ShowIndexesQuery(this.sessionProvider);
  }

  syncConstraints(
    existingNames: string[]
  ): (CreateConstraintQuery | DropConstraintQuery)[] {
    const builder = new ConstraintQueryBuilder(
      this.sessionProvider,
      this.metadataStore().getAllConstraints(),
      existingNames
    );

    return [...builder.buildCreateQueries(), ...builder.buildDropQueries()];
  }

  syncIndexes(existingNames: string[]): (CreateIndexQuery | DropIndexQuery)[] {
    const builder = new IndexQueryBuilder(
      this.sessionProvider,
      this.metadataStore().getAllIndexes(),
      existingNames
    );

    return [...builder.buildCreateQueries(), ...builder.buildDropQueries()];
  }

  private metadataStore(): MetadataStoreInterface {
    return getMetadataStore();
  }
}
