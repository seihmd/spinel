import 'reflect-metadata';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { IdFixture } from '../../fixtures/IdFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { Property } from '../../../../src/decorator/property/Property';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { SaveQueryBuilder } from '../../../../src/query/builder/save/SaveQueryBuilder';
import { SaveQueryPlan } from '../../../../src/query/builder/save/SaveQueryPlan';

const neo4jFixture = Neo4jFixture.new();

@NodeEntity()
class Shop {
  @Primary() private id: string;
  @Property() private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const id = new IdFixture();

describe('save NodeEntity', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('SaveQueryBuilder', () => {
    const queryBuilder = SaveQueryBuilder.new();

    const shop = new Shop(id.get('shop'), 'THE SHOP');
    const [query] = queryBuilder.build(shop);
    expect(query.get()).toBe('MERGE (n0:Shop{id:$n0.id}) SET n0=$n0');
  });

  test('SaveQueryPlan', async () => {
    const saveQueryPlan = SaveQueryPlan.new(neo4jFixture.getDriver());
    const shop = new Shop(id.get('shop'), 'TestShop');
    await saveQueryPlan.execute(shop);

    const savedValue = await neo4jFixture.findNode('Shop', id.get('shop'));
    expect(savedValue).toStrictEqual({
      id: id.get('shop'),
      name: 'TestShop',
    });
  });
});
