import { MetadataStore } from '../../store/MetadataStore';
import { GraphProperties } from '../../schema/graph/GraphProperties';
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
import { GraphFragmentMetadata } from '../../schema/graph/GraphFragmentMetadata';
import { FragmentPatternFormula } from '../../../domain/graph/pattern/formula/FragmentPatternFormula';
import { AssociationPatternFormula } from '../../../domain/graph/pattern/formula/AssociationPatternFormula';
import { NodeConstraints } from '../../schema/constraint/NodeConstraints';
import { RelationshipConstraints } from '../../schema/constraint/RelationshipConstraints';
import { Indexes } from '../../schema/index/Indexes';

class GraphFragmentClass {}

describe(`${MetadataStore.name} for ${GraphFragmentMetadata.name}`, () => {
  test('with no properties', () => {
    const m = new MetadataStore();
    m.registerGraphFragment(GraphFragmentClass, '-formula');

    expect(m.getGraphFragmentMetadata(GraphFragmentClass)).toStrictEqual(
      new GraphFragmentMetadata(
        GraphFragmentClass,
        new FragmentPatternFormula('-formula'),
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

    m.addGraphNode(
      GraphFragmentClass,
      new GraphNodePropertyType('p1', NodeClass)
    );
    m.addGraphRelationship(
      GraphFragmentClass,
      new GraphRelationshipPropertyType('p2', RelationshipClass)
    );
    m.addGraphBranch(
      GraphFragmentClass,
      new GraphBranchPropertyType('p3', GraphFragmentClass),
      new AssociationPatternFormula('p1'),
      1
    );
    m.registerGraphFragment(GraphFragmentClass, '-formula');

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
        new GraphBranchPropertyType('p3', GraphFragmentClass),
        new AssociationPatternFormula('p1'),
        new Depth(1)
      )
    );

    expect(m.getGraphFragmentMetadata(GraphFragmentClass)).toStrictEqual(
      new GraphFragmentMetadata(
        GraphFragmentClass,
        new FragmentPatternFormula('-formula'),
        graphProperties
      )
    );
  });

  test('attempt to get unregistered, throw error', () => {
    expect(() => {
      new MetadataStore().getGraphFragmentMetadata(GraphFragmentClass);
    }).toThrowError();
  });
});
