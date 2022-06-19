import 'reflect-metadata';
import { Primary } from '../../property/Primary';
import { instanceToPlain, plainToClass } from 'class-transformer';

describe('Primary', () => {
  test.each([
    [
      () => {
        class NodeClass {
          @Primary()
          id?: string;
        }
      },
    ],
    [
      () => {
        class NodeClass {
          @Primary()
          id?: number;
        }
      },
    ],
    [
      () => {
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

    expect(instanceToPlain(new NodeClass('a'))).toStrictEqual({ id: 'a' });
  });

  test('aliased class-transform', () => {
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

    expect(
      instanceToPlain(new NodeClass('a'), { excludeExtraneousValues: true })
    ).toStrictEqual({ aliasedId: 'a' });
  });
});
