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

class GraphClass {}

describe(`${MetadataStore.name} for ${GraphMetadata.name}`, () => {
  test('with no properties', () => {
    const m = new MetadataStore();
    m.registerGraph(GraphClass, 'formula');

    expect(m.getGraphMetadata(GraphClass)).toStrictEqual(
      new GraphMetadata(
        GraphClass,
        new GraphPatternFormula('formula'),
        new GraphProperties()
      )
    );
  });

  test('with properties', () => {
    class NodeClass {}

    class RelationshipClass {}

    const m = new MetadataStore();
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
    graphProperties.set(
      new GraphNodeMetadata(
        new GraphNodePropertyType('p1', NodeClass),
        new NodeEntityMetadata(
          NodeClass,
          new NodeLabel(NodeClass),
          new Properties(),
          new NodeConstraints([], [], []),
          new Indexes([])
        )
      )
    );
    graphProperties.set(
      new GraphRelationshipMetadata(
        new GraphRelationshipPropertyType('p2', RelationshipClass),
        new RelationshipEntityMetadata(
          RelationshipClass,
          new RelationshipType(RelationshipClass),
          new Properties(),
          new RelationshipConstraints([]),
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
