import 'reflect-metadata';
import {
  Graph,
  GraphBranch,
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
    this.value = value;
  }

  @Primary({ alias: 'id' })
  private readonly value: string;
}

@Embeddable()
export class ShopInfo {
  @Property()
  private readonly address: string;

  @Property({ alias: 'brand' })
  private readonly name: string;

  constructor(name: string, address: string) {
    this.name = name;
    this.address = address;
  }
}

@NodeEntity('Shop')
export class Shop {
  @Embed()
  id: ID;

  @Embed({ prefix: 'shop_' })
  info: ShopInfo;

  constructor(id: ID, info: ShopInfo) {
    this.id = id;
    this.info = info;
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

@NodeEntity('Item')
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

@RelationshipEntity('HAS_STOCK')
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

@Graph('shop')
export class ShopItems {
  @GraphNode()
  private shop: Shop;

  @GraphBranch(Item, 'shop-[:HAS_STOCK]->.')
  private items: Item[];

  constructor(shop: Shop, items: Item[]) {
    this.shop = shop;
    this.items = items;
  }
}
