import { plainToClass } from 'class-transformer';
import { Property } from 'decorator/property/Property';
import 'reflect-metadata';
import { toPlain } from 'util/toPlain';
import { NodeEntity, Primary } from '../../../../src';

describe('Property', () => {
  test.each([
    [
      () => {
        @NodeEntity('Node')
        class NodeClass {
          @Primary()
          id?: string = '1';

          @Property()
          name?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity('Node')
        class NodeClass {
          @Primary()
          id?: string = '1';

          @Property({})
          name?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity('Node')
        class NodeClass {
          @Primary()
          id?: string = '1';

          @Property({ alias: 'title' })
          name?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity('Node')
        class NodeClass {
          @Primary()
          id?: string = '1';

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
        @NodeEntity('Node')
        class NodeClass {
          @Primary()
          id?: string = '1';

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
    @NodeEntity('Node')
    class NodeClass {
      @Primary()
      id?: string = '1';

      @Property()
      name?: string;

      constructor(name: string) {
        this.name = name;
      }
    }

    expect(plainToClass(NodeClass, { id: '1', name: 'a' })).toStrictEqual(
      new NodeClass('a')
    );

    expect(toPlain(new NodeClass('a'))).toStrictEqual({ id: '1', name: 'a' });
  });

  test('aliased class-transform', () => {
    @NodeEntity('Node')
    class NodeClass {
      @Primary()
      id?: string = '1';

      @Property({ alias: 'title' })
      name?: string;

      constructor(name: string) {
        this.name = name;
      }
    }

    expect(plainToClass(NodeClass, { id: '1', title: 'a' })).toStrictEqual(
      new NodeClass('a')
    );

    expect(toPlain(new NodeClass('a'))).toStrictEqual({ id: '1', title: 'a' });
  });
});
