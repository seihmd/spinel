import 'reflect-metadata';
import {
  Graph,
  GraphBranch,
  GraphFragment,
  GraphNode,
  GraphRelationship,
  NodeEntity,
  Primary,
  Property,
  RelationshipEntity,
} from '../../../../../src';
import { Embeddable } from '../../../../../src/decorator/class/Embeddable';
import { Embed } from '../../../../../src/decorator/property/Embed';
import { digUp } from '../../../../../src/metadata/schema/entity/digUp';
import { embed } from '../../../../../src/metadata/schema/entity/embed';
import { NodeEntityMetadata } from '../../../../../src/metadata/schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../../../../../src/metadata/schema/entity/RelationshipEntityMetadata';
import { GraphMetadata } from '../../../../../src/metadata/schema/graph/GraphMetadata';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';

@Embeddable()
class Embedded {
  @Property()
  private a: string;

  @Property()
  private b: number;

  @Property({ alias: 'c_' })
  private c: string;

  @Property({ alias: 'd_' })
  private d: number;
}

@NodeEntity('Node')
class N {
  @Primary()
  private id: string;

  @Embed()
  private embedded: Embedded;

  @Embed({ prefix: '_' })
  private prefixed: Embedded;
}

@RelationshipEntity('R')
class R {
  @Primary()
  private id: string;

  @Embed()
  private embedded: Embedded;

  @Embed({ prefix: '_' })
  private prefixed: Embedded;
}

@GraphFragment('-n1')
class F {
  @GraphNode()
  private n1: N;

  @GraphBranch(N, 'n1-[]->.')
  private nb: N[];
}

@Graph('n1-r->n2')
class G {
  @GraphNode()
  private n1: N;

  @GraphRelationship()
  private r: R;

  @GraphNode()
  private n2: N;

  @GraphBranch(N, 'n1-[]->.')
  private nb: N[];

  @GraphBranch(G, 'n1-[]->.n1')
  private gb: G[];

  @GraphBranch(F, 'n1-[]')
  private fb: F[];
}

const embeddedN = {
  id: 'id',
  embedded: {
    a: 'A',
    b: 1,
    c_: 'C',
    d_: 'D',
  },
  prefixed: {
    a: 'AA',
    b: 2,
    c_: 'CC',
    d_: 'DD',
  },
};

const dugN = {
  id: 'id',
  a: 'A',
  b: 1,
  c_: 'C',
  d_: 'D',
  _a: 'AA',
  _b: 2,
  _c_: 'CC',
  _d_: 'DD',
};

const embeddedR = {
  id: 'id',
  embedded: {
    a: 'A',
    b: 1,
    c_: 'C',
    d_: 'D',
  },
  prefixed: {
    a: 'AA',
    b: 2,
    c_: 'CC',
    d_: 'DD',
  },
};

const dugR = {
  id: 'id',
  a: 'A',
  b: 1,
  c_: 'C',
  d_: 'D',
  _a: 'AA',
  _b: 2,
  _c_: 'CC',
  _d_: 'DD',
};

describe('embed and digUp', () => {
  const testCases = [
    ['node', dugN, embeddedN, getMetadataStore().getNodeEntityMetadata(N)],
    [
      'relationship',
      dugR,
      embeddedR,
      getMetadataStore().getRelationshipEntityMetadata(R),
    ],
    [
      'graph',
      {
        n1: dugN,
        r: dugR,
        n2: dugN,
      },
      {
        n1: embeddedN,
        r: embeddedR,
        n2: embeddedN,
      },
      getMetadataStore().getGraphMetadata(G),
    ],
    [
      'node branch',
      {
        nb: [dugN],
      },
      {
        nb: [embeddedN],
      },
      getMetadataStore().getGraphMetadata(G),
    ],
    [
      'graph branch',
      {
        gb: [
          {
            n1: dugN,
            gb: [{ r: dugR }],
          },
        ],
      },
      {
        gb: [
          {
            n1: embeddedN,
            gb: [{ r: embeddedR }],
          },
        ],
      },
      getMetadataStore().getGraphMetadata(G),
    ],
    [
      'fragment branch',
      {
        fb: [
          {
            n1: dugN,
            nb: [dugN],
          },
        ],
      },
      {
        fb: [
          {
            n1: embeddedN,
            nb: [embeddedN],
          },
        ],
      },
      getMetadataStore().getGraphMetadata(G),
    ],
  ] as [
    string,
    Record<string, unknown>,
    Record<string, unknown>,
    NodeEntityMetadata | RelationshipEntityMetadata | GraphMetadata
  ][];

  test.each(testCases)(
    'embed %s',
    (
      _: string,
      dug: Record<string, unknown>,
      embedded: Record<string, unknown>,
      metadata: NodeEntityMetadata | RelationshipEntityMetadata | GraphMetadata
    ) => {
      expect(embed(dug, metadata)).toStrictEqual(embedded);
    }
  );

  test.each(testCases)(
    'digUp %s',
    (
      _: string,
      dug: Record<string, unknown>,
      embedded: Record<string, unknown>,
      metadata: NodeEntityMetadata | RelationshipEntityMetadata | GraphMetadata
    ) => {
      expect(digUp(embedded, metadata)).toStrictEqual(dug);
    }
  );
});
