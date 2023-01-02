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

  constructor(a: string, b: number) {
    this.a = a;
    this.b = b;
  }
}

@NodeEntity()
class N {
  @Primary()
  private id: string;

  @Embed()
  private embedded: Embedded;

  constructor(id: string, embedded: Embedded) {
    this.id = id;
    this.embedded = embedded;
  }
}

@RelationshipEntity()
class R {
  @Primary()
  private id: string;

  @Embed()
  private embedded: Embedded;

  constructor(id: string, embedded: Embedded) {
    this.id = id;
    this.embedded = embedded;
  }
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
      },
      getMetadataStore().getNodeEntityMetadata(N)
    );

    expect(embedded).toStrictEqual({
      id: 'id',
      embedded: {
        a: 'A',
        b: 1,
      },
    });
  });

  test('embed relationship properties', () => {
    const embedded = embed(
      {
        id: 'id',
        a: 'A',
        b: 1,
      },
      getMetadataStore().getRelationshipEntityMetadata(R)
    );

    expect(embedded).toStrictEqual({
      id: 'id',
      embedded: {
        a: 'A',
        b: 1,
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
        },
        r: {
          id: 'id',
          a: 'A',
          b: 1,
        },
        n2: {
          id: 'id',
          a: 'A',
          b: 1,
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
      },
      r: {
        embedded: {
          a: 'A',
          b: 1,
        },
        id: 'id',
      },
      n2: {
        embedded: {
          a: 'A',
          b: 1,
        },
        id: 'id',
      },
    });
  });
});
