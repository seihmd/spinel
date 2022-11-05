import {
  Graph,
  GraphBranch,
  GraphNode,
  NodeEntity,
  Primary,
  Property,
} from '../../../src';
import { instantiate } from '../../../src/api/api';

describe('instantiate', () => {
  @NodeEntity()
  class Shop {
    @Primary() private id: string;
    @Property() private name: string;

    constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
    }
  }

  @NodeEntity()
  class User {
    @Primary() private id: string;

    constructor(id: string) {
      this.id = id;
    }
  }

  @Graph('shop')
  class ShopUsers {
    @GraphNode()
    private shop: Shop;

    @GraphBranch(User, 'shop<-:IS_CUSTOMER-*')
    private users: User[];

    constructor(shop: Shop, users: User[]) {
      this.shop = shop;
      this.users = users;
    }
  }

  test('Node', () => {
    const shop = instantiate({ id: '1', name: 'shop1' }, Shop);
    expect(shop).toStrictEqual(new Shop('1', 'shop1'));
  });

  test('Node[]', () => {
    const shops = instantiate(
      [
        { id: '1', name: 'shop1' },
        { id: '2', name: 'shop2' },
      ],
      Shop
    );

    expect(shops).toStrictEqual([
      new Shop('1', 'shop1'),
      new Shop('2', 'shop2'),
    ]);
  });

  test('Graph', () => {
    const shopUsers = instantiate(
      {
        shop: { id: '1', name: 'shop1' },
        users: [{ id: 'A' }, { id: 'B' }],
      },
      ShopUsers
    );

    expect(shopUsers).toStrictEqual(
      new ShopUsers(new Shop('1', 'shop1'), [new User('A'), new User('B')])
    );
  });

  test('Graph[]', () => {
    const shopUsersArray = instantiate(
      [
        {
          shop: { id: '1', name: 'shop1' },
          users: [{ id: 'A' }, { id: 'B' }],
        },
        {
          shop: { id: '2', name: 'shop2' },
          users: [{ id: 'C' }, { id: 'D' }],
        },
      ],
      ShopUsers
    );

    expect(shopUsersArray).toStrictEqual([
      new ShopUsers(new Shop('1', 'shop1'), [new User('A'), new User('B')]),
      new ShopUsers(new Shop('2', 'shop2'), [new User('C'), new User('D')]),
    ]);
  });
});
