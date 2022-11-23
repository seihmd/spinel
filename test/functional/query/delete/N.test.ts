import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { IdFixture } from '../../fixtures/IdFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { DeleteQueryBuilder } from '../../../../src/query/builder/delete/DeleteQueryBuilder';
import { DeleteQueryPlan } from '../../../../src/query/builder/delete/DeleteQueryPlan';

const neo4jFixture = Neo4jFixture.new();

@NodeEntity()
class Shop {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

const id = new IdFixture();

describe('delete NodeEntity', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('DeleteQueryBuilder', () => {
    const queryBuilder = DeleteQueryBuilder.new();

    const shop = new Shop(id.get('shop'));
    const [query] = queryBuilder.build(shop, true);
    expect(query.get()).toBe('MATCH (n0:Shop{id:$n0.id}) DETACH DELETE n0');
  });

  test('DeleteQueryPlan', async () => {
    await neo4jFixture.addNode('Shop', { id: id.get('shop') });

    const deleteQueryPlan = DeleteQueryPlan.new(neo4jFixture.getDriver());
    const shop = new Shop(id.get('shop'));
    await deleteQueryPlan.execute(shop, true);

    const node = await neo4jFixture.findNode('Shop', id.get('shop'));
    expect(node).toBeNull();
  });
});
