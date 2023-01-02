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
import { digUp } from '../../../../../src/metadata/schema/entity/digUp';
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

describe('digUp', () => {
  test('dig up node embedded properties', () => {
    const digged = digUp(
      {
        id: 'id',
        embedded: {
          a: 'A',
          b: 1,
        },
        prefixed: {
          a: 'AA',
          b: 2,
        },
      },
      getMetadataStore().getNodeEntityMetadata(N)
    );

    expect(digged).toStrictEqual({
      id: 'id',
      a: 'A',
      b: 1,
      _a: 'AA',
      _b: 2,
    });
  });

  test('dig up relationship embedded properties', () => {
    const digged = digUp(
      {
        id: 'id',
        embedded: {
          a: 'A',
          b: 1,
        },
        prefixed: {
          a: 'AA',
          b: 2,
        },
      },
      getMetadataStore().getRelationshipEntityMetadata(R)
    );

    expect(digged).toStrictEqual({
      id: 'id',
      a: 'A',
      b: 1,
      _a: 'AA',
      _b: 2,
    });
  });

  test('dig up graph embedded properties', () => {
    const digged = digUp(
      {
        n1: {
          embedded: {
            a: 'A',
            b: 1,
          },
          prefixed: {
            a: 'AA',
            b: 2,
          },
          id: 'id',
        },
        r: {
          embedded: {
            a: 'A',
            b: 1,
          },
          prefixed: {
            a: 'AA',
            b: 2,
          },
          id: 'id',
        },
        n2: {
          embedded: {
            a: 'A',
            b: 1,
          },
          prefixed: {
            a: 'AA',
            b: 2,
          },
          id: 'id',
        },
      },
      getMetadataStore().getGraphMetadata(G)
    );

    expect(digged).toStrictEqual({
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
    });
  });
});
