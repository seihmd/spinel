import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { IdFixture } from '../../fixtures/IdFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { DetachQueryBuilder } from '../../../../src/query/builder/delete/DetachQueryBuilder';
import { RelationshipType } from '../../../../src/domain/relationship/RelationshipType';
import { DetachQueryPlan } from '../../../../src/query/builder/delete/DetachQueryPlan';

const neo4jFixture = Neo4jFixture.new();

@NodeEntity()
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@NodeEntity()
class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

const id = new IdFixture();

describe('detach nodes', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('DetachQueryBuilder', () => {
    const queryBuilder = DetachQueryBuilder.new();

    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item'));
    const [query] = queryBuilder.build(
      shop,
      new RelationshipType('HAS'),
      item,
      '->'
    );
    expect(query.get()).toBe('MATCH (n0:Shop)-[r2:HAS]->(n4:Item) DELETE r2');
  });

  test('DetachQueryPlan', async () => {
    await neo4jFixture.addRelationship(
      'HAS',
      { id: id.get('has') },
      await neo4jFixture.addNode('Shop', { id: id.get('shop') }),
      await neo4jFixture.addNode('Item', { id: id.get('item') }),
      '->'
    );

    const detachQueryPlan = DetachQueryPlan.new(neo4jFixture.getDriver());
    const shop = new Shop(id.get('shop'));
    const item = new Item(id.get('item'));
    await detachQueryPlan.execute(
      shop,
      new RelationshipType('HAS'),
      item,
      '->'
    );

    const has = await neo4jFixture.findRelationship('HAS', id.get('has'));
    expect(has).toBeNull();
  });
});
