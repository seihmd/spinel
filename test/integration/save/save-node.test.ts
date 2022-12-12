import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import { Property } from 'decorator/property/Property';
import 'reflect-metadata';
import { QueryBuilder } from '../../../src/query/builder/QueryBuilder';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

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
const neo4jFixture = Neo4jFixture.new();
const qb = new QueryBuilder(neo4jFixture.getDriver());

describe('Save node', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('save', async () => {
    const shop = new Shop(id.get('shop'), 'shopName');
    const query = qb.save(shop);

    expect(query.getStatement()).toBe('MERGE (n0:Shop{id:$n0.id}) SET n0=$n0');

    await query.run();

    const savedValue = await neo4jFixture.findNode('Shop', id.get('shop'));
    expect(savedValue).toStrictEqual({
      id: id.get('shop'),
      name: 'shopName',
    });
  });
});
