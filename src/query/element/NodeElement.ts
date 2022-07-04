import { NodeLabel } from '../../domain/node/NodeLabel';
import { GraphNodeMetadata } from '../../metadata/schema/graph/GraphNodeMetadata';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { NodeKeyTerm } from '../../domain/graph/pattern/formula/NodeKeyTerm';
import { NodeEntityMetadata } from '../../metadata/schema/entity/NodeEntityMetadata';
import { getMetadataStore } from '../../metadata/store/MetadataStore';

export class NodeElement {
  static new(term: NodeKeyTerm, graphNodeMetadata: GraphNodeMetadata) {
    return new NodeElement(
      term,
      graphNodeMetadata,
      getMetadataStore().getNodeEntityMetadata(graphNodeMetadata.getCstr())
    );
  }

  private readonly term: NodeKeyTerm;
  private readonly graphNodeMetadata: GraphNodeMetadata;
  private readonly nodeEntityMetadata: NodeEntityMetadata;

  constructor(
    term: NodeKeyTerm,
    graphNodeMetadata: GraphNodeMetadata,
    nodeEntityMetadata: NodeEntityMetadata
  ) {
    if (term.getValue() !== graphNodeMetadata.getKey()) {
      throw new Error();
    }
    if (graphNodeMetadata.getCstr() !== nodeEntityMetadata.getCstr()) {
      throw new Error();
    }
    this.term = term;
    this.graphNodeMetadata = graphNodeMetadata;
    this.nodeEntityMetadata = nodeEntityMetadata;
  }

  getLabel(): NodeLabel {
    return this.nodeEntityMetadata.getLabel();
  }

  getCstr(): AnyClassConstructor {
    return this.graphNodeMetadata.getCstr();
  }

  getGraphParameterKey(): string {
    return this.term.getValue();
  }

  getGraphKey(): string {
    return this.term.getValue();
  }
}
