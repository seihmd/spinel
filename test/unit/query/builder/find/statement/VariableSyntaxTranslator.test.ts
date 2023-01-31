import 'reflect-metadata';
import {
  Embed,
  Embeddable,
  Graph,
  GraphBranch,
  GraphNode,
  NodeEntity,
  Primary,
  Property,
} from '../../../../../../src';
import { Depth } from '../../../../../../src/domain/graph/branch/Depth';
import { NodeKeyTerm } from '../../../../../../src/domain/graph/pattern/term/NodeKeyTerm';
import { getMetadataStore } from '../../../../../../src/metadata/store/MetadataStore';
import { VariableSyntaxTranslator } from '../../../../../../src/query/builder/find/statement/VariableSyntaxTranslator';
import { StemBuilder } from '../../../../../../src/query/builder/find/StemBuilder';
import { BranchFilters } from '../../../../../../src/query/builder/find/where/BranchFilters';
import { ElementContext } from '../../../../../../src/query/element/ElementContext';
import { NodeElement } from '../../../../../../src/query/element/NodeElement';
import { BranchIndexes } from '../../../../../../src/query/meterial/BranchIndexes';

@Embeddable()
class Embedded {
  @Primary()
  private readonly ep1: string;

  @Property()
  private readonly ep2: string;

  @Property({ alias: '_ep3' })
  private readonly ep3: string;
}

@NodeEntity('Node')
class N {
  @Primary()
  private readonly id: string;

  @Property()
  private readonly p: string;

  @Embed()
  private readonly e: Embedded;
}

@Graph('n')
class G {
  @GraphNode()
  private readonly n: N;

  @GraphBranch(N, 'n-[]-.')
  private readonly nb: N[];
}

describe('"VariableSyntaxTranslator"', () => {
  const nodeElement = new NodeElement(
    new NodeKeyTerm('_'),
    getMetadataStore().getNodeEntityMetadata(N),
    new ElementContext(new BranchIndexes([]), 0, false)
  );

  const nv = VariableSyntaxTranslator.withNodeElement(nodeElement);
  const stem = StemBuilder.new().build(
    getMetadataStore().getGraphMetadata(G),
    null,
    new BranchFilters([]),
    [],
    null,
    null,
    Depth.withDefault()
  );
  const gv = VariableSyntaxTranslator.withPath(stem.getPath());
  const bv = VariableSyntaxTranslator.withPath(
    stem.getBranches()[0].getPaths()[0],
    stem.getBranches()[0].getMaterial()
  );

  const testCases: [string, VariableSyntaxTranslator, string][] = [
    ['n', nv, 'n0'],
    ['n.id', nv, 'n0.id'],
    ['n.p', nv, 'n0.p'],
    ['n.e.ep1', nv, 'n0.ep1'],
    ['n.e.ep2', nv, 'n0.ep2'],
    ['n.e.ep3', nv, 'n0._ep3'],
    ['n', gv, 'n0'],
    ['n.id', gv, 'n0.id'],
    ['n.p', gv, 'n0.p'],
    ['n.e.ep1', gv, 'n0.ep1'],
    ['n.e.ep2', gv, 'n0.ep2'],
    ['n', bv, 'n0'],
    ['@', bv, 'b0_n4'],
    ['@.id', bv, 'b0_n4.id'],
    ['@.p', bv, 'b0_n4.p'],
    ['@.e.ep1', bv, 'b0_n4.ep1'],
    ['@.e.ep2', bv, 'b0_n4.ep2'],
  ];

  test.each(testCases)(
    'replace variables %s',
    (
      syntax: string,
      variableSyntaxTranslator: VariableSyntaxTranslator,
      expected: string
    ) => {
      expect(variableSyntaxTranslator.translate(syntax)).toBe(expected);
    }
  );
});
