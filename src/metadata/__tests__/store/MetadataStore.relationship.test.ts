import { Properties } from '../../schema/entity/Properties';
import { EntityPrimaryMetadata } from '../../schema/entity/EntityPrimaryMetadata';
import { PrimaryType } from '../../schema/entity/PrimaryType';
import { EntityPropertyMetadata } from '../../schema/entity/EntityPropertyMetadata';
import { PropertyType } from '../../schema/entity/PropertyType';
import { Alias } from '../../schema/entity/Alias';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { MetadataStore } from '../../store/MetadataStore';
import { RelationshipEntityMetadata } from '../../schema/entity/RelationshipEntityMetadata';

class RelationshipClass {}

describe(`${MetadataStore.name} for ${RelationshipEntityMetadata.name}`, () => {
  test('with no properties', () => {
    const m = new MetadataStore();
    m.registerRelationship(RelationshipClass, new RelationshipType('HAS'));

    const n = m.getRelationshipEntityMetadata(RelationshipClass);
    expect(n).toStrictEqual(
      new RelationshipEntityMetadata(
        RelationshipClass,
        new RelationshipType('HAS'),
        new Properties()
      )
    );
  });

  test('with properties', () => {
    const m = new MetadataStore();
    m.setPrimary(
      RelationshipClass,
      new PrimaryType('p1', String),
      new Alias('_p1')
    );
    m.addProperty(RelationshipClass, new PropertyType('p2', Number), null);
    m.addProperty(
      RelationshipClass,
      new PropertyType('p3', Boolean),
      new Alias('_p3')
    );
    m.registerRelationship(RelationshipClass, new RelationshipType('HAS'));

    const properties = new Properties();
    properties.set(
      new EntityPrimaryMetadata(new PrimaryType('p1', String), new Alias('_p1'))
    );
    properties.set(
      new EntityPropertyMetadata(new PropertyType('p2', Number), null)
    );
    properties.set(
      new EntityPropertyMetadata(
        new PropertyType('p3', Boolean),
        new Alias('_p3')
      )
    );

    const relationshipEntityMetadata =
      m.getRelationshipEntityMetadata(RelationshipClass);
    expect(relationshipEntityMetadata).toStrictEqual(
      new RelationshipEntityMetadata(
        RelationshipClass,
        new RelationshipType('HAS'),
        properties
      )
    );
  });

  test('attempt to get unregistered, throw error', () => {
    expect(() => {
      new MetadataStore().getRelationshipEntityMetadata(RelationshipClass);
    }).toThrowError();
  });
});