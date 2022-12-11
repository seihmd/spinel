import { Depth } from '../../../domain/graph/branch/Depth';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { PositiveInt } from '../../../domain/type/PositiveInt';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { ElementContext } from '../../element/ElementContext';
import { NodeElement } from '../../element/NodeElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { Sort } from '../../literal/OrderByLiteral';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { ParameterBag } from '../../parameter/ParameterBag';
import { BranchQueryContext } from '../match/BranchQueryContext';
import { StemBuilder } from '../match/StemBuilder';
import { StemQueryContext } from '../match/StemQueryContext';
import { OrderByQueries } from '../orderBy/OrderByQueries';
import { OrderByQuery } from '../orderBy/OrderByQuery';
import { SessionProviderInterface } from '../session/SessionProviderInterface';
import { WhereQueries } from '../where/WhereQueries';
import { WhereQuery } from '../where/WhereQuery';
import { FindGraphStatement } from './FindGraphStatement';
import { FindNodeStatement } from './FindNodeStatement';
import { FindQuery } from './FindQuery';

export class FindQueryBuilder<T> {
  private readonly sessionProvider: SessionProviderInterface;
  private readonly metadataStore: MetadataStoreInterface;
  private readonly cstr: ClassConstructor<T>;
  private readonly alias: string;

  private whereClauses: [string | null, string][] = [];
  private orderByClauses: [string, Sort][] = [];
  private limitValue: PositiveInt | null = null;
  private depthValue: Depth = Depth.withDefault();

  constructor(
    sessionProvider: SessionProviderInterface,
    metadataStore: MetadataStoreInterface,
    cstr: ClassConstructor<T>,
    alias: string
  ) {
    this.sessionProvider = sessionProvider;
    this.metadataStore = metadataStore;
    this.cstr = cstr;
    this.alias = alias;
  }

  where(key: string | null, clause: string): FindQueryBuilder<T> {
    this.whereClauses.push([key, clause]);
    return this;
  }

  orderBy(clause: string, sort: Sort): FindQueryBuilder<T> {
    this.orderByClauses.push([clause, sort]);
    return this;
  }

  limit(value: number): FindQueryBuilder<T> {
    if (this.limitValue !== null) {
      throw new Error('limit() can only be called once.');
    }

    this.limitValue = new PositiveInt(value);
    return this;
  }

  depth(value: number): FindQueryBuilder<T> {
    this.depthValue = new Depth(value);
    return this;
  }

  buildQuery(parameters: Record<string, unknown>): FindQuery<T> {
    const graphMetadata = this.metadataStore.findGraphMetadata(this.cstr);
    if (graphMetadata) {
      const stem = StemBuilder.new().build(
        graphMetadata,
        this.getWhereQueries(),
        this.getOrderByQueries(),
        this.depthValue
      );
      const stemQueryContext = new StemQueryContext(stem, this.depthValue);
      const branchQueryContexts = stem.getBranches().map((branch) => {
        return new BranchQueryContext(branch);
      });

      return new FindQuery(
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

      return new FindQuery<T>(
        this.sessionProvider,
        new FindNodeStatement(
          NodeLiteral.new(nodeElement, null),
          this.getWhereQueries().ofStem(),
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

  private getWhereQueries(): WhereQueries {
    return new WhereQueries(
      this.whereClauses.map(([key, value]) => new WhereQuery(key, value))
    );
  }

  private getOrderByQueries(): OrderByQueries {
    return new OrderByQueries(
      this.orderByClauses.map(
        ([statement, sort]) => new OrderByQuery(statement, sort)
      )
    );
  }
}
