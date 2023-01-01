import { Embeddable } from '../../decorator/class/Embeddable';
import { Graph } from '../../decorator/class/Graph';
import { GraphFragment } from '../../decorator/class/GraphFragment';
import { IndexOption } from '../../decorator/class/IndexOption';
import { NodeEntity } from '../../decorator/class/NodeEntity';
import { RelationshipEntity } from '../../decorator/class/RelationshipEntity';
import { ConstraintInterface } from '../../domain/constraint/ConstraintInterface';
import { Depth } from '../../domain/graph/branch/Depth';
import { AssociationPatternFormula } from '../../domain/graph/pattern/formula/AssociationPatternFormula';
import { FragmentPatternFormula } from '../../domain/graph/pattern/formula/FragmentPatternFormula';
import { GraphPatternFormula } from '../../domain/graph/pattern/formula/GraphPatternFormula';
import { IndexInterface } from '../../domain/index/IndexInterface';
import { NodeLabel } from '../../domain/node/NodeLabel';
import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { NodeConstraints } from '../schema/constraint/NodeConstraints';
import { RelationshipConstraints } from '../schema/constraint/RelationshipConstraints';
import { Alias } from '../schema/entity/Alias';
import { EmbeddableMetadata } from '../schema/entity/EmbeddableMetadata';
import { EntityEmbedMetadata } from '../schema/entity/EntityEmbedMetadata';
import { EntityPrimaryMetadata } from '../schema/entity/EntityPrimaryMetadata';
import { EntityPropertyMetadata } from '../schema/entity/EntityPropertyMetadata';
import { NodeEntityMetadata } from '../schema/entity/NodeEntityMetadata';
import { PrimaryType } from '../schema/entity/PrimaryType';
import { Properties } from '../schema/entity/Properties';
import { PropertyType } from '../schema/entity/PropertyType';
import { RelationshipEntityMetadata } from '../schema/entity/RelationshipEntityMetadata';
import { PropertiesNotDefinedError } from '../schema/errors/PropertiesNotDefinedError';
import { GraphBranchMetadata } from '../schema/graph/GraphBranchMetadata';
import { GraphBranchPropertyType } from '../schema/graph/GraphBranchPropertyType';
import { GraphFragmentMetadata } from '../schema/graph/GraphFragmentMetadata';
import { GraphMetadata } from '../schema/graph/GraphMetadata';
import { GraphNodeMetadata } from '../schema/graph/GraphNodeMetadata';
import { GraphNodePropertyType } from '../schema/graph/GraphNodePropertyType';
import { GraphProperties } from '../schema/graph/GraphProperties';
import { GraphRelationshipMetadata } from '../schema/graph/GraphRelationshipMetadata';
import { GraphRelationshipPropertyType } from '../schema/graph/GraphRelationshipPropertyType';
import { Indexes } from '../schema/index/Indexes';
import { TransformerInterface } from '../schema/transformation/transformer/TransformerInterface';
import { ClassMetadataMap } from './ClassMetadataMap';
import { MetadataStoreInterface } from './MetadataStoreInterface';
import { PropertyMetadataMap } from './PropertyMetadataMap';

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
  private embeddableMap: ClassMetadataMap<EmbeddableMetadata> =
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

  addEmbed(cstr: AnyClassConstructor, propertyType: PropertyType): void {
    this.propertiesMap.update(cstr, (properties) => {
      properties ??= new Properties();
      properties.set(
        new EntityEmbedMetadata(
          propertyType,
          this.getEmbeddableMetadata(
            propertyType.getType() as AnyClassConstructor
          )
        )
      );

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
    const properties = this.propertiesMap.get(cstr);

    if (!properties) {
      throw PropertiesNotDefinedError.node(cstr);
    }

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
    const properties = this.propertiesMap.get(cstr);

    if (!properties) {
      throw PropertiesNotDefinedError.relationship(cstr);
    }

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

  registerEmbeddable(cstr: AnyClassConstructor): void {
    const properties = this.propertiesMap.get(cstr);

    if (!properties) {
      throw PropertiesNotDefinedError.embeddable(cstr);
    }

    this.embeddableMap.register(cstr, new EmbeddableMetadata(cstr, properties));
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

  getEmbeddableMetadata(cstr: AnyClassConstructor): EmbeddableMetadata {
    const metadata = this.findEmbeddableMetadata(cstr);
    if (!metadata) {
      throw new Error(`${cstr.name} is not registered as ${Embeddable.name}`);
    }

    return metadata;
  }

  findNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata | null {
    return this.nodeEntityMap.get(cstr);
  }

  findEmbeddableMetadata(cstr: AnyClassConstructor): EmbeddableMetadata | null {
    return this.embeddableMap.get(cstr);
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

  getAllConstraints(): ConstraintInterface[] {
    return [
      ...this.nodeEntityMap.getAll().map((n) => n.getConstraints().getAll()),
      ...this.relationshipEntityMap
        .getAll()
        .map((r) => r.getConstraints().getAll()),
    ].flat();
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
