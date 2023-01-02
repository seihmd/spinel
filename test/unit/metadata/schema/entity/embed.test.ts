import 'reflect-metadata';
import {
  Graph,
  GraphNode,
  GraphRelationship,
  NodeEntity,
  Primary,
  Property,
  RelationshipEntity,
} from '../../../../../src';
import { Embeddable } from '../../../../../src/decorator/class/Embeddable';
import { Embed } from '../../../../../src/decorator/property/Embed';
import { embed } from '../../../../../src/metadata/schema/entity/embed';
import { getMetadataStore } from '../../../../../src/metadata/store/MetadataStore';

@Embeddable()
class Embedded {
  @Property()
  private a: string;

  @Property()
  private b: number;
}

@NodeEntity()
class N {
  @Primary()
  private id: string;

  @Embed()
  private embedded: Embedded;

  @Embed({ prefix: '_' })
  private prefixed: Embedded;
}

@RelationshipEntity()
class R {
  @Primary()
  private id: string;

  @Embed()
  private embedded: Embedded;

  @Embed({ prefix: '_' })
  private prefixed: Embedded;
}

@Graph('n1-r->n2')
class G {
  @GraphNode()
  private n1: N;

  @GraphRelationship()
  private r: R;

  @GraphNode()
  private n2: N;
}

describe('embed', () => {
  test('embed node properties', () => {
    const embedded = embed(
      {
        id: 'id',
        a: 'A',
        b: 1,
        _a: 'AA',
        _b: 2,
      },
      getMetadataStore().getNodeEntityMetadata(N)
    );

    expect(embedded).toStrictEqual({
      id: 'id',
      embedded: {
        a: 'A',
        b: 1,
      },
      prefixed: {
        a: 'AA',
        b: 2,
      },
    });
  });

  test('embed relationship properties', () => {
    const embedded = embed(
      {
        id: 'id',
        a: 'A',
        b: 1,
        _a: 'AA',
        _b: 2,
      },
      getMetadataStore().getRelationshipEntityMetadata(R)
    );

    expect(embedded).toStrictEqual({
      id: 'id',
      embedded: {
        a: 'A',
        b: 1,
      },
      prefixed: {
        a: 'AA',
        b: 2,
      },
    });
  });

  test('embed graph properties', () => {
    const embedded = embed(
      {
        n1: {
          id: 'id',
          a: 'A',
          b: 1,
          _a: 'AA',
          _b: 2,
        },
        r: {
          id: 'id',
          a: 'A',
          b: 1,
          _a: 'AA',
          _b: 2,
        },
        n2: {
          id: 'id',
          a: 'A',
          b: 1,
          _a: 'AA',
          _b: 2,
        },
      },
      getMetadataStore().getGraphMetadata(G)
    );

    expect(embedded).toStrictEqual({
      n1: {
        embedded: {
          a: 'A',
          b: 1,
        },
        id: 'id',
        prefixed: {
          a: 'AA',
          b: 2,
        },
      },
      n2: {
        embedded: {
          a: 'A',
          b: 1,
        },
        id: 'id',
        prefixed: {
          a: 'AA',
          b: 2,
        },
      },
      r: {
        embedded: {
          a: 'A',
          b: 1,
        },
        id: 'id',
        prefixed: {
          a: 'AA',
          b: 2,
        },
      },
    });
  });
});
