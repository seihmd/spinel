import { NodeLabel } from '../../../domain/node/NodeLabel';
import { NodeEntityMetadata } from '../../schema/entity/NodeEntityMetadata';
import { Properties } from '../../schema/entity/Properties';
import { EntityPrimaryMetadata } from '../../schema/entity/EntityPrimaryMetadata';
import { PrimaryType } from '../../schema/entity/PrimaryType';
import { EntityPropertyMetadata } from '../../schema/entity/EntityPropertyMetadata';
import { PropertyType } from '../../schema/entity/PropertyType';
import { Alias } from '../../schema/entity/Alias';
import { MetadataStore } from '../../store/MetadataStore';
import { NodeConstraints } from '../../schema/constraint/NodeConstraints';
import { NodePropertyExistenceConstraintMetadata } from '../../schema/constraint/NodePropertyExistenceConstraintMetadata';
import { UniquenessConstraintMetadata } from '../../schema/constraint/UniquenessConstraintMetadata';

class NodeClass {}

describe(`${MetadataStore.name} for ${NodeEntityMetadata.name}`, () => {
  test('with no properties', () => {
    const m = new MetadataStore();
    m.registerNode(NodeClass, new NodeLabel('User'));

    const n = m.getNodeEntityMetadata(NodeClass);
    expect(n).toStrictEqual(
      new NodeEntityMetadata(
        NodeClass,
        new NodeLabel('User'),
        new Properties(),
        new NodeConstraints([], [], [])
      )
    );
  });

  test('with properties', () => {
    const m = new MetadataStore();
    m.setPrimary(
      NodeClass,
      new PrimaryType('p1', String),
      new Alias('_p1'),
      null,
      null
    );
    m.addProperty(
      NodeClass,
      new PropertyType('p2', Number),
      null,
      null,
      false,
      false,
      null
    );
    m.addProperty(
      NodeClass,
      new PropertyType('p3', Boolean),
      new Alias('_p3'),
      null,
      false,
      false,
      null
    );
    m.registerNode(NodeClass, new NodeLabel('User'));

    const properties = new Properties();
    properties.set(
      new EntityPrimaryMetadata(
        new PrimaryType('p1', String),
        new Alias('_p1'),
        null
      )
    );
    properties.set(
      new EntityPropertyMetadata(new PropertyType('p2', Number), null, null)
    );
    properties.set(
      new EntityPropertyMetadata(
        new PropertyType('p3', Boolean),
        new Alias('_p3'),
        null
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
          [
            new NodePropertyExistenceConstraintMetadata(
              new NodeLabel('User'),
              new EntityPrimaryMetadata(
                new PrimaryType('p1', String),
                new Alias('_p1'),
                null
              )
            ),
          ],
          [
            new UniquenessConstraintMetadata(
              new NodeLabel('User'),
              new EntityPrimaryMetadata(
                new PrimaryType('p1', String),
                new Alias('_p1'),
                null
              )
            ),
          ]
        )
      )
    );
  });

  test('attempt to get unregistered, throw error', () => {
    expect(() => {
      new MetadataStore().getNodeEntityMetadata(NodeClass);
    }).toThrowError();
  });
});
