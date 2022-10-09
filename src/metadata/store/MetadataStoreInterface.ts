import { NodeLabel } from '../../domain/node/NodeLabel';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { Alias } from '../schema/entity/Alias';
import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { NodeEntityMetadata } from '../schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../schema/entity/RelationshipEntityMetadata';
import { GraphMetadata } from '../schema/graph/GraphMetadata';
import { PrimaryType } from '../schema/entity/PrimaryType';
import { PropertyType } from '../schema/entity/PropertyType';
import { GraphBranchPropertyType } from '../schema/graph/GraphBranchPropertyType';
import { GraphNodePropertyType } from '../schema/graph/GraphNodePropertyType';
import { GraphRelationshipPropertyType } from '../schema/graph/GraphRelationshipPropertyType';
import { GraphFragmentMetadata } from '../schema/graph/GraphFragmentMetadata';
import { AssociationPatternFormula } from '../../domain/graph/pattern/formula/AssociationPatternFormula';
import { TransformerInterface } from '../schema/transformation/transformer/TransformerInterface';

export interface MetadataStoreInterface {
  setPrimary(
    cstr: AnyClassConstructor,
    primaryType: PrimaryType,
    alias: Alias | null,
    transformer: TransformerInterface | null
  ): void;

  addProperty(
    cstr: AnyClassConstructor,
    propertyType: PropertyType,
    alias: Alias | null,
    transformer: TransformerInterface | null
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

  registerNode(cstr: AnyClassConstructor, label: NodeLabel): void;

  registerRelationship(cstr: AnyClassConstructor, type: RelationshipType): void;

  registerGraph(cstr: AnyClassConstructor, formula: string): void;

  registerGraphFragment(cstr: AnyClassConstructor, formula: string): void;

  getNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata;

  findNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata | null;

  getRelationshipEntityMetadata(
    cstr: AnyClassConstructor
  ): RelationshipEntityMetadata;

  findRelationshipEntityMetadata(
    cstr: AnyClassConstructor
  ): RelationshipEntityMetadata | null;

  getGraphMetadata(cstr: AnyClassConstructor): GraphMetadata;

  findGraphMetadata(cstr: AnyClassConstructor): GraphMetadata | null;

  getGraphFragmentMetadata(cstr: AnyClassConstructor): GraphFragmentMetadata;

  findGraphFragmentMetadata(
    cstr: AnyClassConstructor
  ): GraphFragmentMetadata | null;
}
