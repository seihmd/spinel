import 'reflect-metadata';
import { NodeEntity, Primary, Property } from '../../../../../src';
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
class Entity {
  @Primary()
  private id: string;

  @Embed()
  private embedded: Embedded;

  constructor(id: string, embedded: Embedded) {
    this.id = id;
    this.embedded = embedded;
  }
}

describe('embed', () => {
  test('embed properties', () => {
    const embedded = embed(
      {
        id: 'id',
        a: 'A',
        b: 1,
      },
      getMetadataStore().getNodeEntityMetadata(Entity)
    );

    expect(embedded).toStrictEqual({
      id: 'id',
      embedded: {
        a: 'A',
        b: 1,
      },
    });
  });
});
