import { instance, mock, when } from 'ts-mockito';
import { EntityPrimaryMetadata } from '../../../schema/entity/EntityPrimaryMetadata';
import { EntityPropertyMetadata } from '../../../schema/entity/EntityPropertyMetadata';
import { Properties } from '../../../schema/entity/Properties';
import { PropertyType } from '../../../schema/entity/PropertyType';
import { PrimaryType } from '../../../schema/entity/PrimaryType';
import { NothingTransformer } from '../../../schema/transformation/transformer/NothingTransformer';

function createPropertyStub(key: string): EntityPropertyMetadata {
  const propertyType = mock(PropertyType);
  when(propertyType.getKey()).thenReturn(key);
  return new EntityPropertyMetadata(instance(propertyType), null, null);
}

function createPrimaryStub(key: string): EntityPrimaryMetadata {
  const primaryType = mock(PrimaryType);
  when(primaryType.getKey()).thenReturn(key);
  return new EntityPrimaryMetadata(
    instance(primaryType),
    null,
    new NothingTransformer()
  );
}

describe(`${Properties.name}`, () => {
  test('set and get', () => {
    const properties = new Properties();

    const primary = createPrimaryStub('primary');
    const prop1 = createPropertyStub('prop1');
    const prop2 = createPropertyStub('prop2');

    properties.set(primary);
    properties.set(prop1);
    properties.set(prop2);

    expect(properties.getPrimary()).toBe(primary);
    expect(properties.getProperties()).toStrictEqual([prop1, prop2]);
  });

  test('primary is null, getPrimary throw error', () => {
    const properties = new Properties();
    expect(() => {
      properties.getPrimary();
    }).toThrowError();
  });
});
