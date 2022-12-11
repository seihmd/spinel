import { Depth } from '../../../domain/graph/branch/Depth';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { ElementContext } from '../../element/ElementContext';
import { NodeElement } from '../../element/NodeElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { OrderByQueries } from '../orderBy/OrderByQueries';
import { WhereQueries } from '../where/WhereQueries';
import { BranchQueryContext } from './BranchQueryContext';
import { MatchNodeQuery } from './MatchNodeQuery';
import { Query } from './Query';
import { StemBuilder } from './StemBuilder';
import { StemQueryContext } from './StemQueryContext';

/**
 * @deprecated
 */
export class QueryBuilder {
  static new(): QueryBuilder {
    return new QueryBuilder(StemBuilder.new(), getMetadataStore());
  }

  private readonly stemBuilder: StemBuilder;
  private readonly metadataStore: MetadataStoreInterface;

  constructor(stemBuilder: StemBuilder, metadataStore: MetadataStoreInterface) {
    this.stemBuilder = stemBuilder;
    this.metadataStore = metadataStore;
  }

  build(
    cstr: AnyClassConstructor,
    whereQueries: WhereQueries,
    orderByQueries: OrderByQueries,
    depth: Depth = Depth.withDefault()
  ): Query | MatchNodeQuery {
    const graphMetadata = this.metadataStore.findGraphMetadata(cstr);
    if (graphMetadata) {
      const stem = this.stemBuilder.build(
        graphMetadata,
        whereQueries,
        orderByQueries,
        depth
      );
      const stemQueryContext = new StemQueryContext(stem, depth);
      const branchQueryContexts = stem.getBranches().map((branch) => {
        return new BranchQueryContext(branch);
      });

      return new Query(stemQueryContext, branchQueryContexts);
    }

    const nodeMetadata = this.metadataStore.findNodeEntityMetadata(cstr);
    if (nodeMetadata) {
      const nodeElement = new NodeElement(
        new NodeKeyTerm('n'),
        nodeMetadata,
        new ElementContext(new BranchIndexes([]), 0, false)
      );
      return new MatchNodeQuery(
        NodeLiteral.new(nodeElement, null),
        whereQueries.ofStem(),
        orderByQueries
      );
    }

    const rel = this.metadataStore.findRelationshipEntityMetadata(cstr);
    if (rel) {
      throw new Error('Relationship instance cannot be matched alone');
    }

    throw new Error(`Metadata of class "${cstr.name}" is not found`);
  }
}
