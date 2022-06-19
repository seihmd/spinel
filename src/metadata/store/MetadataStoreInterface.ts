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

export interface MetadataStoreInterface {
  setPrimary(
    cstr: AnyClassConstructor,
    primaryType: PrimaryType,
    alias: Alias | null
  ): void;

  addProperty(
    cstr: AnyClassConstructor,
    propertyType: PropertyType,
    alias: Alias | null
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
    keyMapping: [string, string],
    depth: number
  ): void;

  registerNode(cstr: AnyClassConstructor, label: NodeLabel): void;

  registerRelationship(cstr: AnyClassConstructor, type: RelationshipType): void;

  registerGraph(cstr: AnyClassConstructor, formula: string): void;

  getNodeEntityMetadata(cstr: AnyClassConstructor): NodeEntityMetadata;

  getRelationshipEntityMetadata(
    cstr: AnyClassConstructor
  ): RelationshipEntityMetadata;

  getGraphMetadata(cstr: AnyClassConstructor): GraphMetadata;
}
