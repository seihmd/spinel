import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import { QueryBuilder } from 'query/builder/match/QueryBuilder';
import { QueryPlan } from 'query/builder/match/QueryPlan';
import { OrderByQueries } from 'query/builder/orderBy/OrderByQueries';
import { WhereQueries } from 'query/builder/where/WhereQueries';
import { WhereQuery } from 'query/builder/where/WhereQuery';
import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';

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

  getId(): string {
    return this.id;
  }
}

class ItemArray extends Array<Item> {
  findById(id: string): Item | null {
    return this.find((value) => value.getId() === id) ?? null;
  }
}

@Graph('shop')
class ShopItems {
  @GraphNode() private shop: Shop;
  @GraphBranch(Item, 'shop-:HAS->*') private setItems: Set<Item>;
  @GraphBranch(Item, 'shop-:HAS->*') private itemArray: ItemArray;

  constructor(shop: Shop, setItems: Set<Item>, itemArray: ItemArray) {
    this.shop = shop;
    this.setItems = setItems;
    this.itemArray = itemArray;
  }
}

const id = new IdFixture();

describe('map Neo4j Record into N-:R-G[] Graph class', () => {
  beforeAll(async () => {
    const shop = await neo4jFixture.addNode('Shop', {
      id: id.get('shop'),
    });
    const setItem1 = await neo4jFixture.addNode('Item', {
      id: id.get('setItem1'),
    });
    const setItem2 = await neo4jFixture.addNode('Item', {
      id: id.get('setItem2'),
    });
    const itemArray1 = await neo4jFixture.addNode('Item', {
      id: id.get('itemArray1'),
    });
    const itemArray2 = await neo4jFixture.addNode('Item', {
      id: id.get('itemArray2'),
    });

    await neo4jFixture.addRelationship('HAS', {}, shop, setItem1, '->');
    await neo4jFixture.addRelationship('HAS', {}, shop, setItem2, '->');
    await neo4jFixture.addRelationship('HAS', {}, shop, itemArray1, '->');
    await neo4jFixture.addRelationship('HAS', {}, shop, itemArray2, '->');
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  const whereQueries = new WhereQueries([
    new WhereQuery(null, '{shop}.id = $shopId'),
    new WhereQuery('setItems', '{*}.id IN $setItemIds'),
    new WhereQuery('itemArray', '{*}.id IN $itemArrayIds'),
  ]);

  test('QueryBuilder', () => {
    const queryBuilder = QueryBuilder.new();
    const query = queryBuilder.build(
      ShopItems,
      whereQueries,
      new OrderByQueries([])
    );
    expect(query.get('_')).toBe(
      'MATCH (n0:Shop) ' +
        'WHERE n0.id = $shopId ' +
        'RETURN {shop:n0{.*},' +
        'setItems:[(n0)-[b0_r2:HAS]->(b0_n4:Item) WHERE b0_n4.id IN $setItemIds|b0_n4{.*}],' +
        'itemArray:[(n0)-[b1_r2:HAS]->(b1_n4:Item) WHERE b1_n4.id IN $itemArrayIds|b1_n4{.*}]} AS _'
    );
  });

  test('QueryPlan', async () => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());
    const results = await queryPlan.execute(ShopItems, {
      whereQueries,
      parameters: {
        shopId: id.get('shop'),
        setItemIds: [id.get('setItem1'), id.get('setItem2')],
        itemArrayIds: [id.get('itemArray1'), id.get('itemArray2')],
      },
    });
    expect(results).toStrictEqual([
      new ShopItems(
        new Shop(id.get('shop')),
        new Set([new Item(id.get('setItem2')), new Item(id.get('setItem1'))]),
        new ItemArray(
          new Item(id.get('itemArray2')),
          new Item(id.get('itemArray1'))
        )
      ),
    ]);
  });
});
