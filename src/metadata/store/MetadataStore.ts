import { PropertyMetadataMap } from './PropertyMetadataMap';
import { RelationshipEntity } from '../../decorator/class/RelationshipEntity';
import { NodeEntity } from '../../decorator/class/NodeEntity';
import { GraphProperties } from '../schema/graph/GraphProperties';
import { GraphMetadata } from '../schema/graph/GraphMetadata';
import { GraphNodeMetadata } from '../schema/graph/GraphNodeMetadata';
import { GraphNodePropertyType } from '../schema/graph/GraphNodePropertyType';
import { GraphRelationshipPropertyType } from '../schema/graph/GraphRelationshipPropertyType';
import { GraphRelationshipMetadata } from '../schema/graph/GraphRelationshipMetadata';
import { GraphBranchMetadata } from '../schema/graph/GraphBranchMetadata';
import { GraphBranchPropertyType } from '../schema/graph/GraphBranchPropertyType';
import { Depth } from '../../domain/graph/branch/Depth';
import { ClassMetadataMap } from './ClassMetadataMap';
import { PatternFormula } from '../../domain/graph/pattern/formula/PatternFormula';
import { NodeLabel } from '../../domain/node/NodeLabel';
import { MetadataStoreInterface } from './MetadataStoreInterface';
import { EntityPrimaryMetadata } from '../schema/entity/EntityPrimaryMetadata';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { Alias } from '../schema/entity/Alias';
import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { Properties } from '../schema/entity/Properties';
import { PrimaryType } from '../schema/entity/PrimaryType';
import { NodeEntityMetadata } from '../schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../schema/entity/RelationshipEntityMetadata';
import { Graph } from '../../decorator/class/Graph';
import { PropertyType } from '../schema/entity/PropertyType';
import { EntityPropertyMetadata } from '../schema/entity/EntityPropertyMetadata';

export class MetadataStore implements MetadataStoreInterface {
  private propertiesMap: PropertyMetadataMap<Properties> =
    new PropertyMetadataMap();
  private nodeEntityMap: ClassMetadataMap<NodeEntityMetadata> =
    new ClassMetadataMap();
  private relationshipEntityMap: ClassMetadataMap<RelationshipEntityMetadata> =
    new ClassMetadataMap();

  private graphPropertiesMap: PropertyMetadataMap<GraphProperties> =
    new PropertyMetadataMap();
  private graphMap: ClassMetadataMap<GraphMetadata> = new ClassMetadataMap();

  setPrimary(
    cstr: AnyClassConstructor,
    primaryType: PrimaryType,
    alias: Alias | null
  ): void {
    this.propertiesMap.update(cstr, (properties) => {
      properties ??= new Properties();
      properties.set(new EntityPrimaryMetadata(primaryType, alias));
      return properties;
    });
  }

  addProperty(
    cstr: AnyClassConstructor,
    propertyType: PropertyType,
    alias: Alias | null
  ): void {
    this.propertiesMap.update(cstr, (properties) => {
      properties ??= new Properties();
      properties.set(new EntityPropertyMetadata(propertyType, alias));
      return properties;
    });
  }

  registerNode(cstr: AnyClassConstructor, label: NodeLabel): void {
    this.nodeEntityMap.register(
      cstr,
      new NodeEntityMetadata(
        cstr,
        label,
        this.propertiesMap.get(cstr) ?? new Properties()
      )
    );
  }

  registerRelationship(
    cstr: AnyClassConstructor,
    type: RelationshipType
  ): void {
    this.relationshipEntityMap.register(
      cstr,
      new RelationshipEntityMetadata(
        cstr,
        type,
        this.propertiesMap.get(cstr) ?? new Properties()
      )
    );
  }

  addGraphNode(
    cstr: AnyClassConstructor,
    graphNodePropertyType: GraphNodePropertyType
  ): void {
    this.graphPropertiesMap.update(cstr, (graphProperties) => {
      if (!graphProperties) {
        graphProperties = new GraphProperties();
      }
      graphProperties.set(new GraphNodeMetadata(graphNodePropertyType));
      return graphProperties;
    });
  }

  addGraphRelationship(
    cstr: AnyClassConstructor,
    graphRelationshipPropertyType: GraphRelationshipPropertyType
  ): void {
    this.graphPropertiesMap.update(cstr, (graphProperties) => {
      if (!graphProperties) {
        graphProperties = new GraphProperties();
      }
      graphProperties.set(
        new GraphRelationshipMetadata(graphRelationshipPropertyType)
      );
      return graphProperties;
    });
  }

  addGraphBranch(
    cstr: AnyClassConstructor,
    graphBranchPropertyType: GraphBranchPropertyType,
    keyMapping: [string, string],
    depth: number
  ): void {
    this.graphPropertiesMap.update(cstr, (graphProperties) => {
      if (!graphProperties) {
        graphProperties = new GraphProperties();
      }
      graphProperties.set(
        new GraphBranchMetadata(
          graphBranchPropertyType,
          keyMapping,
          new Depth(depth)
        )
      );
      return graphProperties;
    });
  }

  registerGraph(cstr: AnyClassConstructor, formula: string): void {
    this.graphMap.register(
      cstr,
      new GraphMetadata(
        cstr,
        new PatternFormula(formula),
        this.graphPropertiesMap.get(cstr) || new GraphProperties()
      )
    );
  }

  getNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata {
    const metadata = this.nodeEntityMap.get(cstr);
    if (!metadata) {
      throw new Error(`${cstr.name} is not registered as ${NodeEntity.name}`);
    }

    return metadata;
  }

  getRelationshipEntityMetadata(
    cstr: AnyClassConstructor
  ): RelationshipEntityMetadata {
    const metadata = this.relationshipEntityMap.get(cstr);
    if (!metadata) {
      throw new Error(
        `${cstr.name} is not registered as ${RelationshipEntity.name}`
      );
    }

    return metadata;
  }

  getGraphMetadata(cstr: AnyClassConstructor): GraphMetadata {
    const metadata = this.graphMap.get(cstr);
    if (!metadata) {
      throw new Error(`${cstr.name} is not registered as ${Graph.name}`);
    }

    return metadata;
  }
}

let metadataStore: MetadataStoreInterface = new MetadataStore();

export const injectMetadataStore = (m: MetadataStoreInterface) => {
  metadataStore = m;
};

export const getMetadataStore = (): MetadataStoreInterface => {
  return metadataStore;
};
