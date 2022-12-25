import { Graph } from 'decorator/class/Graph';
import { NodeEntity } from 'decorator/class/NodeEntity';
import { GraphBranch } from 'decorator/property/GraphBranch';
import { GraphNode } from 'decorator/property/GraphNode';
import { Primary } from 'decorator/property/Primary';
import 'reflect-metadata';
import { QueryDriver } from '../../../src/query/driver/QueryDriver';
import { IdFixture } from '../fixtures/IdFixture';
import { Neo4jFixture } from '../fixtures/neo4jFixture';

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

@NodeEntity()
class Tag {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('item')
class ItemTags {
  @GraphNode() private item: Item;
  @GraphBranch(Tag, 'item-[:HAS_TAG]->tags')
  private tags: Tag[];

  constructor(item: Item, tags: Tag[]) {
    this.item = item;
    this.tags = tags;
  }
}

@Graph('shop')
class ShopItemTags {
  @GraphNode() private shop: Shop;
  @GraphBranch(ItemTags, 'shop-[:HAS_STOCK]->itemTags.item')
  private itemTags: ItemTags[];

  constructor(shop: Shop, itemTags: ItemTags[]) {
    this.shop = shop;
    this.itemTags = itemTags;
  }
}

const id = new IdFixture();
const neo4jFixture = Neo4jFixture.new();
const qd = new QueryDriver(neo4jFixture.getDriver());

describe('save N-:R-G[] graph', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
    await neo4jFixture.close();
  });

  test.each([
    [[], 'MERGE (n0:Shop{id:$n0.id}) SET n0=$n0'],
    [
      [new ItemTags(new Item(id.get('item1')), [])],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (n0)-[b0_0_r2:HAS_STOCK]->(b0_0_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4',
    ],
    [
      [new ItemTags(new Item(id.get('item1')), [new Tag(id.get('tag1'))])],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (b0_0_b0_0_n4:Tag{id:$b0_0_b0_0_n4.id}) ' +
        'MERGE (n0)-[b0_0_r2:HAS_STOCK]->(b0_0_n4) ' +
        'MERGE (b0_0_n4)-[b0_0_b0_0_r2:HAS_TAG]->(b0_0_b0_0_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_0_b0_0_n4=$b0_0_b0_0_n4',
    ],
    [
      [
        new ItemTags(new Item(id.get('item1')), [
          new Tag(id.get('tag1')),
          new Tag(id.get('tag2')),
        ]),
      ],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (b0_0_b0_0_n4:Tag{id:$b0_0_b0_0_n4.id}) ' +
        'MERGE (b0_0_b0_1_n4:Tag{id:$b0_0_b0_1_n4.id}) ' +
        'MERGE (n0)-[b0_0_r2:HAS_STOCK]->(b0_0_n4) ' +
        'MERGE (b0_0_n4)-[b0_0_b0_0_r2:HAS_TAG]->(b0_0_b0_0_n4) ' +
        'MERGE (b0_0_n4)-[b0_0_b0_1_r2:HAS_TAG]->(b0_0_b0_1_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_0_b0_0_n4=$b0_0_b0_0_n4 ' +
        'SET b0_0_b0_1_n4=$b0_0_b0_1_n4',
    ],
    [
      [
        new ItemTags(new Item(id.get('item1')), [
          new Tag(id.get('tag1')),
          new Tag(id.get('tag2')),
        ]),
        new ItemTags(new Item(id.get('item2')), [
          new Tag(id.get('tag3')),
          new Tag(id.get('tag4')),
        ]),
      ],
      'MERGE (n0:Shop{id:$n0.id}) ' +
        'MERGE (b0_0_n4:Item{id:$b0_0_n4.id}) ' +
        'MERGE (b0_0_b0_0_n4:Tag{id:$b0_0_b0_0_n4.id}) ' +
        'MERGE (b0_0_b0_1_n4:Tag{id:$b0_0_b0_1_n4.id}) ' +
        'MERGE (b0_1_n4:Item{id:$b0_1_n4.id}) ' +
        'MERGE (b0_1_b0_0_n4:Tag{id:$b0_1_b0_0_n4.id}) ' +
        'MERGE (b0_1_b0_1_n4:Tag{id:$b0_1_b0_1_n4.id}) ' +
        'MERGE (n0)-[b0_0_r2:HAS_STOCK]->(b0_0_n4) ' +
        'MERGE (b0_0_n4)-[b0_0_b0_0_r2:HAS_TAG]->(b0_0_b0_0_n4) ' +
        'MERGE (b0_0_n4)-[b0_0_b0_1_r2:HAS_TAG]->(b0_0_b0_1_n4) ' +
        'MERGE (n0)-[b0_1_r2:HAS_STOCK]->(b0_1_n4) ' +
        'MERGE (b0_1_n4)-[b0_1_b0_0_r2:HAS_TAG]->(b0_1_b0_0_n4) ' +
        'MERGE (b0_1_n4)-[b0_1_b0_1_r2:HAS_TAG]->(b0_1_b0_1_n4) ' +
        'SET n0=$n0 ' +
        'SET b0_0_n4=$b0_0_n4 ' +
        'SET b0_0_b0_0_n4=$b0_0_b0_0_n4 ' +
        'SET b0_0_b0_1_n4=$b0_0_b0_1_n4 ' +
        'SET b0_1_n4=$b0_1_n4 ' +
        'SET b0_1_b0_0_n4=$b0_1_b0_0_n4 ' +
        'SET b0_1_b0_1_n4=$b0_1_b0_1_n4',
    ],
  ])('statement', (itemTags: ItemTags[], expected: string) => {
    const shopCustomer = new ShopItemTags(new Shop(id.get('shop')), itemTags);
    const query = qd.builder().save(shopCustomer);
    expect(query.getStatement()).toBe(expected);
  });

  test('save', async () => {
    const shopItemTags = new ShopItemTags(new Shop(id.get('shop')), [
      new ItemTags(new Item(id.get('item1')), [
        new Tag(id.get('tag1')),
        new Tag(id.get('tag2')),
      ]),
      new ItemTags(new Item(id.get('item2')), [
        new Tag(id.get('tag3')),
        new Tag(id.get('tag4')),
      ]),
    ]);

    await qd.builder().save(shopItemTags).run();

    const savedValue =
      await neo4jFixture.findGraph(`MATCH (shop:Shop{id:"${id.get(
        'shop'
      )}"})-[:HAS_STOCK]->(item1:Item{id:"${id.get('item1')}"})
    MATCH (shop:Shop{id:"${id.get(
      'shop'
    )}"})-[:HAS_STOCK]->(item2:Item{id:"${id.get('item2')}"})
    MATCH (item1)-[:HAS_TAG]->(tag1:Tag{id:"${id.get('tag1')}"})
    MATCH (item1)-[:HAS_TAG]->(tag2:Tag{id:"${id.get('tag2')}"})
    MATCH (item2)-[:HAS_TAG]->(tag3:Tag{id:"${id.get('tag3')}"})
    MATCH (item2)-[:HAS_TAG]->(tag4:Tag{id:"${id.get('tag4')}"})
    RETURN 
    shop, 
    item1, tag1, tag2,
    item2, tag3, tag4`);
    expect(savedValue).toStrictEqual({
      shop: {
        id: id.get('shop'),
      },
      item1: {
        id: id.get('item1'),
      },
      tag2: {
        id: id.get('tag2'),
      },
      tag1: {
        id: id.get('tag1'),
      },
      item2: {
        id: id.get('item2'),
      },
      tag4: {
        id: id.get('tag4'),
      },
      tag3: {
        id: id.get('tag3'),
      },
    });
  });
});
