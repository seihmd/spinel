import { EntityPrimaryMetadata } from 'metadata/schema/entity/EntityPrimaryMetadata';
import { EntityPropertyMetadata } from 'metadata/schema/entity/EntityPropertyMetadata';
import { PrimaryType } from 'metadata/schema/entity/PrimaryType';
import { Properties } from 'metadata/schema/entity/Properties';
import { PropertyType } from 'metadata/schema/entity/PropertyType';
import { NothingTransformer } from 'metadata/schema/transformation/transformer/NothingTransformer';
import { instance, mock, when } from 'ts-mockito';

function createPropertyStub(key: string): EntityPropertyMetadata {
  const propertyType = mock(PropertyType);
  when(propertyType.getKey()).thenReturn(key);
  return new EntityPropertyMetadata(instance(propertyType), null, null, false);
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
});
