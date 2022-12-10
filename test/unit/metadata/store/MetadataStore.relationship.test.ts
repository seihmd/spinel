import { RelationshipPropertyExistenceConstraint } from 'domain/constraint/RelationshipPropertyExistenceConstraint';
import { RelationshipType } from 'domain/relationship/RelationshipType';
import { RelationshipConstraints } from 'metadata/schema/constraint/RelationshipConstraints';
import { Alias } from 'metadata/schema/entity/Alias';
import { EntityPrimaryMetadata } from 'metadata/schema/entity/EntityPrimaryMetadata';
import { EntityPropertyMetadata } from 'metadata/schema/entity/EntityPropertyMetadata';
import { PrimaryType } from 'metadata/schema/entity/PrimaryType';
import { Properties } from 'metadata/schema/entity/Properties';
import { PropertyType } from 'metadata/schema/entity/PropertyType';
import { RelationshipEntityMetadata } from 'metadata/schema/entity/RelationshipEntityMetadata';
import { Indexes } from 'metadata/schema/index/Indexes';
import { MetadataStore } from 'metadata/store/MetadataStore';

class RelationshipClass {}

describe(`${MetadataStore.name} for ${RelationshipEntityMetadata.name}`, () => {
  test('with no properties', () => {
    const m = new MetadataStore();
    m.registerRelationship(RelationshipClass, new RelationshipType('HAS'), []);

    const n = m.getRelationshipEntityMetadata(RelationshipClass);
    expect(n).toStrictEqual(
      new RelationshipEntityMetadata(
        RelationshipClass,
        new RelationshipType('HAS'),
        new Properties(),
        new RelationshipConstraints([]),
        new Indexes([])
      )
    );
  });

  test('with properties', () => {
    const m = new MetadataStore();
    m.setPrimary(
      RelationshipClass,
      new PrimaryType('p1', String),
      new Alias('_p1'),
      null
    );
    m.addProperty(
      RelationshipClass,
      new PropertyType('p2', Number),
      null,
      null,
      false
    );
    m.addProperty(
      RelationshipClass,
      new PropertyType('p3', Boolean),
      new Alias('_p3'),
      null,
      false
    );
    m.registerRelationship(RelationshipClass, new RelationshipType('HAS'), []);

    const properties = new Properties();
    properties.set(
      new EntityPrimaryMetadata(
        new PrimaryType('p1', String),
        new Alias('_p1'),
        null
      )
    );
    properties.set(
      new EntityPropertyMetadata(
        new PropertyType('p2', Number),
        null,
        null,
        false
      )
    );
    properties.set(
      new EntityPropertyMetadata(
        new PropertyType('p3', Boolean),
        new Alias('_p3'),
        null,
        false
      )
    );

    const relationshipEntityMetadata =
      m.getRelationshipEntityMetadata(RelationshipClass);
    expect(relationshipEntityMetadata).toStrictEqual(
      new RelationshipEntityMetadata(
        RelationshipClass,
        new RelationshipType('HAS'),
        properties,
        new RelationshipConstraints([
          new RelationshipPropertyExistenceConstraint(
            new RelationshipType('HAS'),
            '_p1'
          ),
        ]),
        new Indexes([])
      )
    );
  });

  test('attempt to get unregistered, throw error', () => {
    expect(() => {
      new MetadataStore().getRelationshipEntityMetadata(RelationshipClass);
    }).toThrowError();
  });
});
