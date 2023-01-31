import { plainToClass } from 'class-transformer';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { toPlain } from 'util/toPlain';
import { NodeEntity } from '../../../../src';

describe('Primary', () => {
  test.each([
    [
      () => {
        @NodeEntity('Node')
        class NodeClass {
          @Primary()
          id?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity('Node')
        class NodeClass {
          @Primary({})
          id?: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity('Node')
        class NodeClass {
          @Primary({ alias: 'aliasedId' })
          id?: string;
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
      id?: string;

      constructor(id: string) {
        this.id = id;
      }
    }

    expect(plainToClass(NodeClass, { id: 'a' })).toStrictEqual(
      new NodeClass('a')
    );

    expect(toPlain(new NodeClass('a'))).toStrictEqual({ id: 'a' });
  });

  test('aliased class-transform', () => {
    @NodeEntity('Node')
    class NodeClass {
      @Primary({ alias: 'aliasedId' })
      id?: string;

      constructor(id: string) {
        this.id = id;
      }
    }

    expect(plainToClass(NodeClass, { aliasedId: 'a' })).toStrictEqual(
      new NodeClass('a')
    );

    expect(toPlain(new NodeClass('a'))).toStrictEqual({ aliasedId: 'a' });
  });
});
