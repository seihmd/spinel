import 'reflect-metadata';

import { Node } from 'neo4j-driver-core';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Graph } from '../../../../src/decorator/class/Graph';
import { WhereQuery } from '../../../../src/query/builder/where/WhereQuery';
import { IdFixture } from '../../fixtures/IdFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { WhereQueries } from '../../../../src/query/builder/where/WhereQueries';
import { GraphNode } from '../../../../src/decorator/property/GraphNode';
import { QueryPlan } from '../../../../src/query/builder/match/QueryPlan';
import { Depth } from '../../../../src/domain/graph/branch/Depth';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import { GraphBranch } from '../../../../src/decorator/property/GraphBranch';

const neo4jFixture = Neo4jFixture.new();

@NodeEntity()
class Item {
  @Primary() private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

@Graph('item')
class SimilarItems {
  @GraphNode() private item: Item;
  @GraphBranch(SimilarItems, 'item-:IS_SIMILAR->*.item')
  private similarItems: SimilarItems[] = [];

  constructor(item: Item, similarItems: SimilarItems[]) {
    this.item = item;
    this.similarItems = similarItems;
  }
}

async function addItem(name: string): Promise<Node> {
  return await neo4jFixture.addNode('Item', {
    id: id.get(name),
  });
}

const id = new IdFixture();

describe('map Neo4j Record into Graph class with depth', () => {
  beforeAll(async () => {
    const item = await addItem('item');
    const similar1 = await addItem('similar1');
    const similar2 = await addItem('similar2');
    const similar1_1 = await addItem('similar1_1');
    const similar1_2 = await addItem('similar1_2');
    const similar2_1 = await addItem('similar2_1');
    const similar2_2 = await addItem('similar2_2');

    await neo4jFixture.addRelationship('IS_SIMILAR', {}, item, similar1, '->');
    await neo4jFixture.addRelationship('IS_SIMILAR', {}, item, similar2, '->');
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      similar1,
      similar1_1,
      '->'
    );
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      similar1,
      similar1_2,
      '->'
    );
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      similar2,
      similar2_1,
      '->'
    );
    await neo4jFixture.addRelationship(
      'IS_SIMILAR',
      {},
      similar2,
      similar2_2,
      '->'
    );
  });

  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test.each([
    [new Depth(0), new SimilarItems(new Item(id.get('item')), [])],
    [
      new Depth(1),
      new SimilarItems(new Item(id.get('item')), [
        new SimilarItems(new Item(id.get('similar2')), []),
        new SimilarItems(new Item(id.get('similar1')), []),
      ]),
    ],
    [
      new Depth(2),
      new SimilarItems(new Item(id.get('item')), [
        new SimilarItems(new Item(id.get('similar2')), [
          new SimilarItems(new Item(id.get('similar2_2')), []),
          new SimilarItems(new Item(id.get('similar2_1')), []),
        ]),
        new SimilarItems(new Item(id.get('similar1')), [
          new SimilarItems(new Item(id.get('similar1_2')), []),
          new SimilarItems(new Item(id.get('similar1_1')), []),
        ]),
      ]),
    ],
  ])('map nested graphs', async (depth: Depth, expected: SimilarItems) => {
    const queryPlan = QueryPlan.new(neo4jFixture.getDriver());

    const results = await queryPlan.execute(
      SimilarItems,
      new WhereQueries([new WhereQuery(null, '{item}.id=$item.id')]),
      depth,
      {
        item: { id: id.get('item') },
      }
    );
    expect(results).toStrictEqual([expected]);
  });
});
