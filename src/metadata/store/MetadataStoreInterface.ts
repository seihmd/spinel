import { IndexOption } from '../../decorator/class/IndexOption';
import { ConstraintInterface } from '../../domain/constraint/ConstraintInterface';
import { AssociationPatternFormula } from '../../domain/graph/pattern/formula/AssociationPatternFormula';
import { IndexInterface } from '../../domain/index/IndexInterface';
import { NodeLabel } from '../../domain/node/NodeLabel';
import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { Alias } from '../schema/entity/Alias';
import { EmbeddableMetadata } from '../schema/entity/EmbeddableMetadata';
import { NodeEntityMetadata } from '../schema/entity/NodeEntityMetadata';
import { PrimaryType } from '../schema/entity/PrimaryType';
import { PropertyType } from '../schema/entity/PropertyType';
import { RelationshipEntityMetadata } from '../schema/entity/RelationshipEntityMetadata';
import { GraphBranchPropertyType } from '../schema/graph/GraphBranchPropertyType';
import { GraphFragmentMetadata } from '../schema/graph/GraphFragmentMetadata';
import { GraphMetadata } from '../schema/graph/GraphMetadata';
import { GraphNodePropertyType } from '../schema/graph/GraphNodePropertyType';
import { GraphRelationshipPropertyType } from '../schema/graph/GraphRelationshipPropertyType';
import { TransformerInterface } from '../schema/transformation/transformer/TransformerInterface';

export interface MetadataStoreInterface {
  setPrimary(
    cstr: AnyClassConstructor,
    primaryType: PrimaryType,
    alias: Alias | null,
    transformer: TransformerInterface | null
  ): void;

  addEmbed(cstr: AnyClassConstructor, propertyType: PropertyType): void;

  addProperty(
    cstr: AnyClassConstructor,
    propertyType: PropertyType,
    alias: Alias | null,
    transformer: TransformerInterface | null,
    notNull: boolean
  ): void;

  addGraphNode(
    cstr: AnyClassConstructor,
    graphNodePropertyType: GraphNodePropertyType,
    type?: AnyClassConstructor
  ): void;

  addGraphRelationship(
    cstr: AnyClassConstructor,
    graphRelationshipPropertyType: GraphRelationshipPropertyType,
    type?: AnyClassConstructor
  ): void;

  addGraphBranch(
    cstr: AnyClassConstructor,
    graphBranchPropertyType: GraphBranchPropertyType,
    associationPatternFormula: AssociationPatternFormula,
    depth: number
  ): void;

  registerNode(
    cstr: AnyClassConstructor,
    label: NodeLabel,
    unique: string[],
    keys: string[][],
    indexes: IndexOption[]
  ): void;

  registerRelationship(
    cstr: AnyClassConstructor,
    type: RelationshipType,
    indexes: IndexOption[]
  ): void;

  registerGraph(cstr: AnyClassConstructor, formula: string): void;

  registerGraphFragment(cstr: AnyClassConstructor, formula: string): void;

  registerEmbeddable(cstr: AnyClassConstructor): void;

  getNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata;

  findNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata | null;

  getRelationshipEntityMetadata(
    cstr: AnyClassConstructor
  ): RelationshipEntityMetadata;

  findRelationshipEntityMetadata(
    cstr: AnyClassConstructor
  ): RelationshipEntityMetadata | null;

  getEmbeddableMetadata(cstr: AnyClassConstructor): EmbeddableMetadata;

  findEmbeddableMetadata(cstr: AnyClassConstructor): EmbeddableMetadata | null;

  getGraphMetadata(cstr: AnyClassConstructor): GraphMetadata;

  findGraphMetadata(cstr: AnyClassConstructor): GraphMetadata | null;

  getGraphFragmentMetadata(cstr: AnyClassConstructor): GraphFragmentMetadata;

  findGraphFragmentMetadata(
    cstr: AnyClassConstructor
  ): GraphFragmentMetadata | null;

  getAllConstraints(): ConstraintInterface[];

  getAllIndexes(): IndexInterface[];
}
