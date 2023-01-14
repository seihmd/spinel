import { NodePropertyExistenceConstraint } from 'domain/constraint/NodePropertyExistenceConstraint';
import { UniquenessConstraint } from 'domain/constraint/UniquenessConstraint';
import { NodeLabel } from 'domain/node/NodeLabel';
import { NodeConstraints } from 'metadata/schema/constraint/NodeConstraints';
import { Alias } from 'metadata/schema/entity/Alias';
import { EntityPrimaryMetadata } from 'metadata/schema/entity/EntityPrimaryMetadata';
import { EntityPropertyMetadata } from 'metadata/schema/entity/EntityPropertyMetadata';
import { NodeEntityMetadata } from 'metadata/schema/entity/NodeEntityMetadata';
import { PrimaryType } from 'metadata/schema/entity/PrimaryType';
import { Properties } from 'metadata/schema/entity/Properties';
import { PropertyType } from 'metadata/schema/entity/PropertyType';
import { Indexes } from 'metadata/schema/index/Indexes';
import { MetadataStore } from 'metadata/store/MetadataStore';
import { PropertiesNotDefinedError } from '../../../../src/metadata/schema/errors/PropertiesNotDefinedError';

class NodeClass {}

describe(`${MetadataStore.name} for ${NodeEntityMetadata.name}`, () => {
  test('when no properties, throw Error', () => {
    const m = new MetadataStore();

    expect(() => {
      m.registerNode(NodeClass, new NodeLabel('User'), [], [], []);
    }).toThrowError(PropertiesNotDefinedError.node(NodeClass));
  });

  test('with properties', () => {
    const m = new MetadataStore();
    m.setPrimary(
      NodeClass,
      new PrimaryType('p1', String),
      new Alias('_p1'),
      null
    );
    m.addProperty(NodeClass, new PropertyType('p2', Number), null, null, false);
    m.addProperty(
      NodeClass,
      new PropertyType('p3', Boolean),
      new Alias('_p3'),
      null,
      false
    );
    m.registerNode(NodeClass, new NodeLabel('User'), [], [], []);

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

    const nodeEntityMetadata = m.getNodeEntityMetadata(NodeClass);
    expect(nodeEntityMetadata).toMatchObject(
      new NodeEntityMetadata(
        NodeClass,
        new NodeLabel('User'),
        properties,
        new NodeConstraints(
          [],
          [new NodePropertyExistenceConstraint(new NodeLabel('User'), '_p1')],
          [new UniquenessConstraint(new NodeLabel('User'), '_p1')]
        ),
        new Indexes([])
      )
    );
  });

  test('attempt to get unregistered, throw error', () => {
    expect(() => {
      new MetadataStore().getNodeEntityMetadata(NodeClass);
    }).toThrowError();
  });
});
