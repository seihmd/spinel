import { NodeLabel } from '../../domain/node/NodeLabel';
import { GraphNodeMetadata } from '../../metadata/schema/graph/GraphNodeMetadata';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { NodeKeyTerm } from '../../domain/graph/pattern/formula/NodeKeyTerm';

export class NodeElement {
  private readonly term: NodeKeyTerm;
  private readonly graphNodeMetadata: GraphNodeMetadata;

  constructor(term: NodeKeyTerm, graphNodeMetadata: GraphNodeMetadata) {
    if (term.getValue() !== graphNodeMetadata.getKey()) {
      throw new Error();
    }
    this.term = term;
    this.graphNodeMetadata = graphNodeMetadata;
  }

  getLabel(): NodeLabel {
    return this.graphNodeMetadata.getLabel();
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
