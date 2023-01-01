import 'reflect-metadata';
import { NodeEntity, Primary, Property } from '../../../../../src';
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

describe('digUp', () => {
  test('dig up embedded properties', () => {
    const digged = digUp(
      {
        id: 'id',
        embedded: {
          a: 'A',
          b: 1,
        },
      },
      getMetadataStore().getNodeEntityMetadata(Entity)
    );

    expect(digged).toStrictEqual({
      id: 'id',
      a: 'A',
      b: 1,
    });
  });
});
