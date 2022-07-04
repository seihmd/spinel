import 'reflect-metadata';
import { Property } from '../../property/Property';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { instance, mock } from 'ts-mockito';
import {
  injectMetadataStore,
  MetadataStore,
} from '../../../metadata/store/MetadataStore';

describe('Property', () => {
  beforeEach(() => {
    const metadataStore = mock(MetadataStore);
    injectMetadataStore(instance(metadataStore));
  });

  test.each([
    [
      () => {
        class NodeClass {
          @Property()
          name?: string;
        }
      },
    ],
    [
      () => {
        class NodeClass {
          @Property({ alias: 'title' })
          name?: string;
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });

  test('class-transform', () => {
    class NodeClass {
      @Property()
      name?: string;

      constructor(name: string) {
        this.name = name;
      }
    }

    expect(plainToClass(NodeClass, { name: 'a' })).toStrictEqual(
      new NodeClass('a')
    );

    expect(instanceToPlain(new NodeClass('a'))).toStrictEqual({ name: 'a' });
  });

  test('aliased class-transform', () => {
    class NodeClass {
      @Property({ alias: 'title' })
      name?: string;

      constructor(name: string) {
        this.name = name;
      }
    }

    expect(plainToClass(NodeClass, { title: 'a' })).toStrictEqual(
      new NodeClass('a')
    );

    expect(
      instanceToPlain(new NodeClass('a'), { excludeExtraneousValues: true })
    ).toStrictEqual({ title: 'a' });
  });
});