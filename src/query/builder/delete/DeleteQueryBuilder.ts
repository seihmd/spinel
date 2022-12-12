import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import {
  AnyClassConstructor,
  ClassConstructor,
} from '../../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { ElementContext } from '../../element/ElementContext';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { Parameter } from '../../parameter/Parameter';
import { ParameterBag } from '../../parameter/ParameterBag';
import { SessionProviderInterface } from '../session/SessionProviderInterface';
import { DeleteNodeStatement } from './DeleteNodeStatement';
import { DeleteQuery } from './DeleteQuery';
import { DeleteRelationshipStatement } from './DeleteRelationshipStatement';

export class DeleteQueryBuilder {
  private readonly sessionProvider: SessionProviderInterface;
  private readonly metadataStore: MetadataStoreInterface;
  private readonly instance: InstanceType<ClassConstructor<object>>;

  constructor(
    sessionProvider: SessionProviderInterface,
    metadataStore: MetadataStoreInterface,
    instance: InstanceType<ClassConstructor<object>>
  ) {
    this.sessionProvider = sessionProvider;
    this.metadataStore = metadataStore;
    this.instance = instance;
  }

  buildQuery(): DeleteQuery {
    const parameterBag = new ParameterBag();
    const cstr = this.instance.constructor as AnyClassConstructor;
    const nodeMetadata = this.metadataStore.findNodeEntityMetadata(cstr);

    if (nodeMetadata) {
      const nodeInstanceElement = new NodeInstanceElement(
        this.instance,
        nodeMetadata,
        new ElementContext(new BranchIndexes([]), 0, false),
        new NodeKeyTerm('_')
      );

      parameterBag.add(
        Parameter.new(
          nodeInstanceElement.getVariableName(),
          nodeInstanceElement.getProperties().parameterize()
        )
      );
      return new DeleteQuery(
        this.sessionProvider,
        new DeleteNodeStatement(nodeInstanceElement),
        parameterBag
      );
    }

    const relationshipMetadata =
      this.metadataStore.findRelationshipEntityMetadata(cstr);
    if (relationshipMetadata) {
      const relationshipInstanceElement = new RelationshipInstanceElement(
        this.instance,
        relationshipMetadata,
        new ElementContext(new BranchIndexes([]), 0, false),
        new RelationshipKeyTerm('r')
      );
      parameterBag.add(
        Parameter.new(
          relationshipInstanceElement.getVariableName(),
          relationshipInstanceElement.getProperties().parameterize()
        )
      );
      return new DeleteQuery(
        this.sessionProvider,
        new DeleteRelationshipStatement(relationshipInstanceElement),
        parameterBag
      );
    }

    throw new Error(
      `Constructor of instance: "${cstr.name}" is not registered as NodeEntity or RelationshipEntity`
    );
  }
}
