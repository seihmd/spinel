import 'reflect-metadata';
import {
  Graph,
  GraphNode,
  GraphRelationship,
  NodeEntity,
  Primary,
  Property,
  RelationshipEntity,
} from '../../../src';
import { Embeddable } from '../../../src/decorator/class/Embeddable';
import { Embed } from '../../../src/decorator/property/Embed';

@Embeddable()
export class ID {
  constructor(value: string) {
    this.id = value;
  }

  @Primary()
  private readonly id: string;
}

@NodeEntity()
export class Shop {
  @Embed()
  id: ID;

  @Property()
  name: string;

  constructor(id: ID, name: string) {
    this.id = id;
    this.name = name;
  }
}

@Embeddable()
export class ItemInfo {
  @Property()
  stock: number;

  @Property()
  arrival: Date;

  constructor(stock: number, arrival: Date) {
    this.stock = stock;
    this.arrival = arrival;
  }
}

@NodeEntity()
export class Item {
  @Embed()
  id: ID;

  @Embed()
  info: ItemInfo;

  constructor(id: ID, info: ItemInfo) {
    this.id = id;
    this.info = info;
  }
}

@RelationshipEntity()
export class HasStock {
  @Embed()
  id: ID;

  constructor(id: ID) {
    this.id = id;
  }
}

@Graph('shop-hasStock->item')
export class ShopItem {
  @GraphNode()
  private shop: Shop;

  @GraphRelationship()
  private hasStock: HasStock;

  @GraphNode()
  private item: Item;

  constructor(shop: Shop, hasStock: HasStock, item: Item) {
    this.shop = shop;
    this.hasStock = hasStock;
    this.item = item;
  }
}
