import { Depth } from '../../../domain/graph/branch/Depth';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { PositiveInt } from '../../../domain/type/PositiveInt';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { WhereStatement } from '../../clause/where/WhereStatement';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ElementContext } from '../../element/ElementContext';
import { NodeElement } from '../../element/NodeElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { Sort } from '../../literal/OrderByLiteral';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { ParameterBag } from '../../parameter/ParameterBag';
import { FindOneQuery } from '../findOne/FindOneQuery';
import { BranchQueryContext } from '../match/BranchQueryContext';
import { StemBuilder } from '../match/StemBuilder';
import { StemQueryContext } from '../match/StemQueryContext';
import { OrderByQueries } from '../orderBy/OrderByQueries';
import { OrderByQuery } from '../orderBy/OrderByQuery';
import { BranchFilter } from '../where/BranchFilter';
import { BranchFilters } from '../where/BranchFilters';
import { FindGraphStatement } from './FindGraphStatement';
import { FindNodeStatement } from './FindNodeStatement';
import { FindQuery } from './FindQuery';

export abstract class AbstractFindQueryBuilder<
  T,
  Q extends FindQuery<T> | FindOneQuery<T>
> {
  private whereStatement: WhereStatement | null = null;
  private branchFilters: BranchFilter[] = [];
  private orderByClauses: [string, Sort][] = [];
  private limitValue: PositiveInt | null = null;
  private depthValue: Depth = Depth.withDefault();

  constructor(
    protected readonly sessionProvider: SessionProviderInterface,
    protected readonly metadataStore: MetadataStoreInterface,
    protected readonly cstr: ClassConstructor<T>,
    protected readonly alias: string
  ) {}

  where(statement: string): AbstractFindQueryBuilder<T, Q> {
    if (this.whereStatement !== null) {
      throw new Error('where() can only be called once.');
    }
    this.whereStatement = new WhereStatement(statement);
    return this;
  }

  filterBranch(key: string, statement: string): AbstractFindQueryBuilder<T, Q> {
    this.branchFilters.push(new BranchFilter(key, statement));
    return this;
  }

  orderBy(clause: string, sort: Sort): AbstractFindQueryBuilder<T, Q> {
    this.orderByClauses.push([clause, sort]);
    return this;
  }

  limit(value: number): AbstractFindQueryBuilder<T, Q> {
    if (this.limitValue !== null) {
      throw new Error('limit() can only be called once.');
    }

    this.limitValue = new PositiveInt(value);
    return this;
  }

  depth(value: number): AbstractFindQueryBuilder<T, Q> {
    this.depthValue = new Depth(value);
    return this;
  }

  buildQuery(parameters: Record<string, unknown>): Q {
    const graphMetadata = this.metadataStore.findGraphMetadata(this.cstr);
    if (graphMetadata) {
      const stem = StemBuilder.new().build(
        graphMetadata,
        this.whereStatement,
        new BranchFilters(this.branchFilters),
        this.getOrderByQueries(),
        this.depthValue
      );
      const stemQueryContext = new StemQueryContext(stem, this.depthValue);
      const branchQueryContexts = stem.getBranches().map((branch) => {
        return new BranchQueryContext(branch);
      });

      return this.createQuery(
        this.sessionProvider,
        new FindGraphStatement(stemQueryContext, branchQueryContexts),
        ParameterBag.new(parameters),
        this.cstr
      );
    }

    const nodeMetadata = this.metadataStore.findNodeEntityMetadata(this.cstr);
    if (nodeMetadata) {
      const nodeElement = new NodeElement(
        new NodeKeyTerm('n'),
        nodeMetadata,
        new ElementContext(new BranchIndexes([]), 0, false)
      );

      return this.createQuery(
        this.sessionProvider,
        new FindNodeStatement(
          NodeLiteral.new(nodeElement, null),
          this.whereStatement,
          this.getOrderByQueries()
        ),
        ParameterBag.new(parameters),
        this.cstr
      );
    }

    const rel = this.metadataStore.findRelationshipEntityMetadata(this.cstr);
    if (rel) {
      throw new Error('Relationship instance cannot be matched alone');
    }

    throw new Error(`Metadata of class "${this.cstr.name}" is not found`);
  }

  protected abstract createQuery(
    sessionProvider: SessionProviderInterface,
    statement: FindGraphStatement | FindNodeStatement,
    parameterBag: ParameterBag,
    cstr: ClassConstructor<T>
  ): Q;

  private getOrderByQueries(): OrderByQueries {
    return new OrderByQueries(
      this.orderByClauses.map(
        ([statement, sort]) => new OrderByQuery(statement, sort)
      )
    );
  }
}
