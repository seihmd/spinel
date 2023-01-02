import { plainToClass } from 'class-transformer';
import { Property } from 'decorator/property/Property';
import 'reflect-metadata';
import { toPlain } from 'util/toPlain';
import { NodeEntity } from '../../../../src';

describe('Property', () => {
  test.each([
    [
      () => {
        @NodeEntity()
        class NodeClass {
          @Property()
          name?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity()
        class NodeClass {
          @Property({})
          name?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity()
        class NodeClass {
          @Property({ alias: 'title' })
          name?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity()
        class NodeClass {
          @Property({
            alias: 'hoge',
            notNull: true,
          })
          name?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity()
        class NodeClass {
          @Property({
            alias: 'hoge',
            notNull: false,
          })
          name?: string;
        }
      },
    ],
  ])('Valid definition', (definition: () => void) => {
    expect(definition).not.toThrowError();
  });

  test('class-transform', () => {
    @NodeEntity()
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

    expect(toPlain(new NodeClass('a'))).toStrictEqual({ name: 'a' });
  });

  test('aliased class-transform', () => {
    @NodeEntity()
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

    expect(toPlain(new NodeClass('a'))).toStrictEqual({ title: 'a' });
  });
});
