import { Depth } from '../../../domain/graph/branch/Depth';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { PositiveInt } from '../../../domain/type/PositiveInt';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { LimitClause } from '../../clause/LimitClause';
import { WhereStatement } from '../../clause/where/WhereStatement';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ElementContext } from '../../element/ElementContext';
import { NodeElement } from '../../element/NodeElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { OrderByLiteral, Sort } from '../../literal/OrderByLiteral';
import { VariableMap } from '../../literal/util/VariableMap';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { ParameterBag } from '../../parameter/ParameterBag';
import { FindOneQuery } from '../findOne/FindOneQuery';
import { BranchFilter } from '../where/BranchFilter';
import { BranchFilters } from '../where/BranchFilters';
import { BranchQueryContext } from './BranchQueryContext';
import { FindGraphStatement } from './FindGraphStatement';
import { FindNodeStatement } from './FindNodeStatement';
import { FindQuery } from './FindQuery';
import { OrderByStatement } from './orderBy/OrderByStatement';
import { StemBuilder } from './StemBuilder';
import { StemQueryContext } from './StemQueryContext';

export abstract class AbstractFindQueryBuilder<
  T,
  Q extends FindQuery<T> | FindOneQuery<T>
> {
  private whereStatement: WhereStatement | null = null;
  private branchFilters: BranchFilter[] = [];
  private orderByStatements: OrderByStatement[] = [];
  private limitValue: PositiveInt | null = null;
  private depthValue: Depth = Depth.withDefault();

  constructor(
    protected readonly sessionProvider: SessionProviderInterface,
    protected readonly metadataStore: MetadataStoreInterface,
    protected readonly cstr: ClassConstructor<T>
  ) {}

  where(statement: string): AbstractFindQueryBuilder<T, Q> {
    if (this.whereStatement !== null) {
      throw new Error('where() can only be called once.');
    }
    this.whereStatement = new WhereStatement(statement);
    return this;
  }

  filterBranch(
    path: string,
    statement: string
  ): AbstractFindQueryBuilder<T, Q> {
    this.branchFilters.push(new BranchFilter(path, statement));
    return this;
  }

  orderBy(clause: string, sort: Sort): AbstractFindQueryBuilder<T, Q> {
    this.orderByStatements.push(new OrderByStatement(clause, sort));
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
        this.orderByStatements,
        this.limitValue,
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
          this.whereStatement?.assign(
            VariableMap.withNodeElement(nodeElement)
          ) ?? null,
          this.getOrderByLiterals(VariableMap.withNodeElement(nodeElement)),
          this.limitValue ? new LimitClause(this.limitValue) : null
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

  private getOrderByLiterals(variableMap: VariableMap): OrderByLiteral[] {
    return this.orderByStatements.map((s) =>
      OrderByLiteral.new(s.getStatement(), s.getSort(), variableMap)
    );
  }
}
