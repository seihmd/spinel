import { Depth } from 'domain/graph/branch/Depth';
import { AssociationPatternFormula } from 'domain/graph/pattern/formula/AssociationPatternFormula';
import { GraphPatternFormula } from 'domain/graph/pattern/formula/GraphPatternFormula';
import { NodeLabel } from 'domain/node/NodeLabel';
import { RelationshipType } from 'domain/relationship/RelationshipType';
import { NodeConstraints } from 'metadata/schema/constraint/NodeConstraints';
import { RelationshipConstraints } from 'metadata/schema/constraint/RelationshipConstraints';
import { NodeEntityMetadata } from 'metadata/schema/entity/NodeEntityMetadata';
import { Properties } from 'metadata/schema/entity/Properties';
import { RelationshipEntityMetadata } from 'metadata/schema/entity/RelationshipEntityMetadata';
import { GraphBranchMetadata } from 'metadata/schema/graph/GraphBranchMetadata';
import { GraphBranchPropertyType } from 'metadata/schema/graph/GraphBranchPropertyType';
import { GraphMetadata } from 'metadata/schema/graph/GraphMetadata';
import { GraphNodeMetadata } from 'metadata/schema/graph/GraphNodeMetadata';
import { GraphNodePropertyType } from 'metadata/schema/graph/GraphNodePropertyType';
import { GraphProperties } from 'metadata/schema/graph/GraphProperties';
import { GraphRelationshipMetadata } from 'metadata/schema/graph/GraphRelationshipMetadata';
import { GraphRelationshipPropertyType } from 'metadata/schema/graph/GraphRelationshipPropertyType';
import { Indexes } from 'metadata/schema/index/Indexes';
import { MetadataStore } from 'metadata/store/MetadataStore';
import 'reflect-metadata';
import { NodePropertyExistenceConstraint } from '../../../../src/domain/constraint/NodePropertyExistenceConstraint';
import { RelationshipPropertyExistenceConstraint } from '../../../../src/domain/constraint/RelationshipPropertyExistenceConstraint';
import { UniquenessConstraint } from '../../../../src/domain/constraint/UniquenessConstraint';
import { EntityPrimaryMetadata } from '../../../../src/metadata/schema/entity/EntityPrimaryMetadata';
import { PrimaryType } from '../../../../src/metadata/schema/entity/PrimaryType';

class NodeClass {}

class RelationshipClass {}

class GraphClass {}

describe(`MetadataStore for GraphMetadata`, () => {
  test('with properties', () => {
    const m = new MetadataStore();

    m.setPrimary(NodeClass, new PrimaryType('p1', String), null, null);
    m.setPrimary(RelationshipClass, new PrimaryType('p1', String), null, null);

    m.registerNode(NodeClass, new NodeLabel(NodeClass), [], [], []);
    m.registerRelationship(
      RelationshipClass,
      new RelationshipType(RelationshipClass),
      []
    );

    m.addGraphNode(GraphClass, new GraphNodePropertyType('p1', NodeClass));
    m.addGraphRelationship(
      GraphClass,
      new GraphRelationshipPropertyType('p2', RelationshipClass)
    );
    m.addGraphBranch(
      GraphClass,
      new GraphBranchPropertyType('p3', GraphClass),
      new AssociationPatternFormula('p1-[:R]->.'),
      1
    );
    m.registerGraph(GraphClass, 'formula');

    const graphProperties = new GraphProperties();
    const nodeProperties = new Properties();
    nodeProperties.set(
      new EntityPrimaryMetadata(new PrimaryType('p1', String), null, null)
    );
    graphProperties.set(
      new GraphNodeMetadata(
        new GraphNodePropertyType('p1', NodeClass),
        new NodeEntityMetadata(
          NodeClass,
          new NodeLabel(NodeClass),
          nodeProperties,
          new NodeConstraints(
            [],
            [
              new NodePropertyExistenceConstraint(
                new NodeLabel('NodeClass'),
                'p1'
              ),
            ],
            [new UniquenessConstraint(new NodeLabel('NodeClass'), 'p1')]
          ),
          new Indexes([])
        )
      )
    );

    const relationshipProperties = new Properties();
    relationshipProperties.set(
      new EntityPrimaryMetadata(new PrimaryType('p1', String), null, null)
    );
    graphProperties.set(
      new GraphRelationshipMetadata(
        new GraphRelationshipPropertyType('p2', RelationshipClass),
        new RelationshipEntityMetadata(
          RelationshipClass,
          new RelationshipType(RelationshipClass),
          relationshipProperties,
          new RelationshipConstraints([
            new RelationshipPropertyExistenceConstraint(
              new RelationshipType('RELATIONSHIP_CLASS'),
              'p1'
            ),
          ]),
          new Indexes([])
        )
      )
    );
    graphProperties.set(
      new GraphBranchMetadata(
        new GraphBranchPropertyType('p3', GraphClass),
        new AssociationPatternFormula('p1-[:R]->.'),
        new Depth(1)
      )
    );

    expect(m.getGraphMetadata(GraphClass)).toStrictEqual(
      new GraphMetadata(
        GraphClass,
        new GraphPatternFormula('formula'),
        graphProperties
      )
    );
  });

  test('attempt to get unregistered, throw error', () => {
    expect(() => {
      new MetadataStore().getGraphMetadata(GraphClass);
    }).toThrowError();
  });
});
