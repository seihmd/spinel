import { MetadataStore } from '../../store/MetadataStore';
import { GraphMetadata } from '../../schema/graph/GraphMetadata';
import { GraphProperties } from '../../schema/graph/GraphProperties';
import { PatternFormula } from '../../../domain/graph/pattern/formula/PatternFormula';
import { GraphNodePropertyType } from '../../schema/graph/GraphNodePropertyType';
import { GraphRelationshipPropertyType } from '../../schema/graph/GraphRelationshipPropertyType';
import { GraphBranchPropertyType } from '../../schema/graph/GraphBranchPropertyType';
import { GraphNodeMetadata } from '../../schema/graph/GraphNodeMetadata';
import { GraphRelationshipMetadata } from '../../schema/graph/GraphRelationshipMetadata';
import { GraphBranchMetadata } from '../../schema/graph/GraphBranchMetadata';
import { Depth } from '../../../domain/graph/branch/Depth';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { NodeEntityMetadata } from '../../schema/entity/NodeEntityMetadata';
import { Properties } from '../../schema/entity/Properties';
import { RelationshipEntityMetadata } from '../../schema/entity/RelationshipEntityMetadata';

class GraphClass {}

describe(`${MetadataStore.name} for ${GraphMetadata.name}`, () => {
  test('with no properties', () => {
    const m = new MetadataStore();
    m.registerGraph(GraphClass, 'formula');

    expect(m.getGraphMetadata(GraphClass)).toStrictEqual(
      new GraphMetadata(
        GraphClass,
        new PatternFormula('formula'),
        new GraphProperties()
      )
    );
  });

  test('with properties', () => {
    class NodeClass {}

    class RelationshipClass {}

    const m = new MetadataStore();
    m.registerNode(NodeClass, new NodeLabel(NodeClass));
    m.registerRelationship(
      RelationshipClass,
      new RelationshipType(RelationshipClass)
    );

    m.addGraphNode(GraphClass, new GraphNodePropertyType('p1', NodeClass));
    m.addGraphRelationship(
      GraphClass,
      new GraphRelationshipPropertyType('p2', RelationshipClass)
    );
    m.addGraphBranch(
      GraphClass,
      new GraphBranchPropertyType('p3', GraphClass),
      ['p1', 'p4'],
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
          new Properties()
        )
      )
    );
    graphProperties.set(
      new GraphRelationshipMetadata(
        new GraphRelationshipPropertyType('p2', RelationshipClass),
        new RelationshipEntityMetadata(
          RelationshipClass,
          new RelationshipType(RelationshipClass),
          new Properties()
        )
      )
    );
    graphProperties.set(
      new GraphBranchMetadata(
        new GraphBranchPropertyType('p3', GraphClass),
        ['p1', 'p4'],
        new Depth(1)
      )
    );

    expect(m.getGraphMetadata(GraphClass)).toStrictEqual(
      new GraphMetadata(
        GraphClass,
        new PatternFormula('formula'),
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
