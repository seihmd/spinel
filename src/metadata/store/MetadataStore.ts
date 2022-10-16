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
import { GraphPatternFormula } from '../../domain/graph/pattern/formula/GraphPatternFormula';
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
import { GraphFragmentMetadata } from '../schema/graph/GraphFragmentMetadata';
import { GraphFragment } from '../../decorator/class/GraphFragment';
import { FragmentPatternFormula } from '../../domain/graph/pattern/formula/FragmentPatternFormula';
import { AssociationPatternFormula } from '../../domain/graph/pattern/formula/AssociationPatternFormula';
import { TransformerInterface } from '../schema/transformation/transformer/TransformerInterface';
import { NodeConstraints } from '../schema/constraint/NodeConstraints';
import { RelationshipConstraints } from '../schema/constraint/RelationshipConstraints';
import { IndexOption } from '../../decorator/class/IndexOption';
import { Indexes } from '../schema/index/Indexes';
import { IndexInterface } from '../../domain/index/IndexInterface';

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
  private graphFragmentMap: ClassMetadataMap<GraphFragmentMetadata> =
    new ClassMetadataMap();

  setPrimary(
    cstr: AnyClassConstructor,
    primaryType: PrimaryType,
    alias: Alias | null,
    transformer: TransformerInterface | null
  ): void {
    this.propertiesMap.update(cstr, (properties) => {
      properties ??= new Properties();
      const primaryMetadata = new EntityPrimaryMetadata(
        primaryType,
        alias,
        transformer ?? null
      );
      properties.set(primaryMetadata);

      return properties;
    });
  }

  addProperty(
    cstr: AnyClassConstructor,
    propertyType: PropertyType,
    alias: Alias | null,
    transformer: TransformerInterface | null,
    notNull: boolean
  ): void {
    this.propertiesMap.update(cstr, (properties) => {
      properties ??= new Properties();
      const propertyMetadata = new EntityPropertyMetadata(
        propertyType,
        alias,
        transformer ?? null,
        notNull
      );
      properties.set(propertyMetadata);

      return properties;
    });
  }

  registerNode(
    cstr: AnyClassConstructor,
    label: NodeLabel,
    unique: string[],
    key: string[][],
    indexes: IndexOption[]
  ): void {
    const properties = this.propertiesMap.get(cstr) ?? new Properties();
    this.nodeEntityMap.register(
      cstr,
      new NodeEntityMetadata(
        cstr,
        label,
        properties,
        NodeConstraints.new(key, unique, label, properties),
        Indexes.new(label, indexes, properties)
      )
    );
  }

  registerRelationship(
    cstr: AnyClassConstructor,
    type: RelationshipType,
    indexes: IndexOption[]
  ): void {
    const properties = this.propertiesMap.get(cstr) ?? new Properties();
    this.relationshipEntityMap.register(
      cstr,
      new RelationshipEntityMetadata(
        cstr,
        type,
        properties,
        RelationshipConstraints.new(type, properties),
        Indexes.new(type, indexes, properties)
      )
    );
  }

  addGraphNode(
    cstr: AnyClassConstructor,
    graphNodePropertyType: GraphNodePropertyType
  ): void {
    const graphNodeMetadata = new GraphNodeMetadata(
      graphNodePropertyType,
      this.getNodeEntityMetadata(graphNodePropertyType.getType())
    );
    this.graphPropertiesMap.update(cstr, (graphProperties) => {
      if (!graphProperties) {
        graphProperties = new GraphProperties();
      }
      graphProperties.set(graphNodeMetadata);
      return graphProperties;
    });
  }

  addGraphRelationship(
    cstr: AnyClassConstructor,
    graphRelationshipPropertyType: GraphRelationshipPropertyType
  ): void {
    const graphNodeMetadata = new GraphRelationshipMetadata(
      graphRelationshipPropertyType,
      this.getRelationshipEntityMetadata(
        graphRelationshipPropertyType.getType()
      )
    );
    this.graphPropertiesMap.update(cstr, (graphProperties) => {
      if (!graphProperties) {
        graphProperties = new GraphProperties();
      }
      graphProperties.set(graphNodeMetadata);
      return graphProperties;
    });
  }

  addGraphBranch(
    cstr: AnyClassConstructor,
    graphBranchPropertyType: GraphBranchPropertyType,
    associationPatternFormula: AssociationPatternFormula,
    depth: number
  ): void {
    this.graphPropertiesMap.update(cstr, (graphProperties) => {
      if (!graphProperties) {
        graphProperties = new GraphProperties();
      }
      graphProperties.set(
        new GraphBranchMetadata(
          graphBranchPropertyType,
          associationPatternFormula,
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
        new GraphPatternFormula(formula),
        this.graphPropertiesMap.get(cstr) || new GraphProperties()
      )
    );
  }

  registerGraphFragment(cstr: AnyClassConstructor, formula: string): void {
    this.graphFragmentMap.register(
      cstr,
      new GraphFragmentMetadata(
        cstr,
        new FragmentPatternFormula(formula),
        this.graphPropertiesMap.get(cstr) || new GraphProperties()
      )
    );
  }

  getNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata {
    const metadata = this.findNodeEntityMetadata(cstr);
    if (!metadata) {
      throw new Error(`${cstr.name} is not registered as ${NodeEntity.name}`);
    }

    return metadata;
  }

  findNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata | null {
    return this.nodeEntityMap.get(cstr);
  }

  getRelationshipEntityMetadata(
    cstr: AnyClassConstructor
  ): RelationshipEntityMetadata {
    const metadata = this.findRelationshipEntityMetadata(cstr);
    if (!metadata) {
      throw new Error(
        `${cstr.name} is not registered as ${RelationshipEntity.name}`
      );
    }

    return metadata;
  }

  findRelationshipEntityMetadata(
    cstr: AnyClassConstructor
  ): RelationshipEntityMetadata | null {
    return this.relationshipEntityMap.get(cstr);
  }

  getGraphMetadata(cstr: AnyClassConstructor): GraphMetadata {
    const metadata = this.findGraphMetadata(cstr);
    if (!metadata) {
      throw new Error(`${cstr.name} is not registered as ${Graph.name}`);
    }

    return metadata;
  }

  findGraphMetadata(cstr: AnyClassConstructor): GraphMetadata | null {
    return this.graphMap.get(cstr);
  }

  getGraphFragmentMetadata(cstr: AnyClassConstructor): GraphFragmentMetadata {
    const metadata = this.findGraphFragmentMetadata(cstr);
    if (!metadata) {
      throw new Error(
        `${cstr.name} is not registered as ${GraphFragment.name}`
      );
    }

    return metadata;
  }

  findGraphFragmentMetadata(
    cstr: AnyClassConstructor
  ): GraphFragmentMetadata | null {
    return this.graphFragmentMap.get(cstr);
  }

  getAllConstraints(): (NodeConstraints | RelationshipConstraints)[] {
    return [
      ...this.nodeEntityMap.getAll().map((n) => n.getConstraints()),
      ...this.relationshipEntityMap.getAll().map((r) => r.getConstraints()),
    ];
  }

  getAllIndexes(): IndexInterface[] {
    return [
      ...this.nodeEntityMap.getAll().map((n) => n.getIndexes().getAll()),
      ...this.relationshipEntityMap
        .getAll()
        .map((r) => r.getIndexes().getAll()),
    ].flat();
  }
}

let metadataStore: MetadataStoreInterface = new MetadataStore();

export const injectMetadataStore = (m: MetadataStoreInterface) => {
  metadataStore = m;
};

export const getMetadataStore = (): MetadataStoreInterface => {
  return metadataStore;
};
