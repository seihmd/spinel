import { Depth } from 'domain/graph/branch/Depth';
import { StemQueryContext } from 'query/builder/find/StemQueryContext';
import { OrderByQueries } from 'query/builder/orderBy/OrderByQueries';
import { Path } from 'query/path/Path';
import { Stem } from 'query/path/Stem';
import { ElementFixture } from './ElementFixture';

describe(`StemQueryContext`, () => {
  test('N-R-N', () => {
    const ef = new ElementFixture();

    const stemQueryContext = new StemQueryContext(
      new Stem(
        Path.new([
          ef.newNodeElement('User', 'user'),
          ef.newDirectionElement('-'),
          ef.newRelationshipElement('LIKES', 'likes'),
          ef.newDirectionElement('->'),
          ef.newNodeElement('Item', 'item'),
        ]),
        null,
        new OrderByQueries([]),
        null,
        []
      ),
      new Depth(2)
    );

    expect(stemQueryContext.getPathLiteral().get()).toBe(
      '(n0:User)-[r2:LIKES]->(n0:Item)'
    );
    expect(stemQueryContext.getMapEntries()).toStrictEqual([
      ['user', 'n0{.*}'],
      ['likes', 'r2{.*}'],
      ['item', 'n0{.*}'],
    ]);
  });

  test(':N-:R-:N', () => {
    const ef = new ElementFixture();

    const stemQueryContext = new StemQueryContext(
      new Stem(
        Path.new([
          ef.newNodeLabelElement('(:User)'),
          ef.newDirectionElement('-'),
          ef.newRelationshipTypeElement('[:LIKES]'),
          ef.newDirectionElement('->'),
          ef.newNodeLabelElement('(:Item)'),
        ]),
        null,
        new OrderByQueries([]),
        null,
        []
      ),
      new Depth(2)
    );

    expect(stemQueryContext.getPathLiteral().get()).toBe(
      '(n0:User)-[r2:LIKES]->(n0:Item)'
    );
    expect(stemQueryContext.getMapEntries()).toStrictEqual([]);
  });

  test('N-:R-:N-R-N', () => {
    const ef = new ElementFixture();

    const stemQueryContext = new StemQueryContext(
      new Stem(
        Path.new([
          ef.newNodeElement('User', 'user'),
          ef.newDirectionElement('-'),
          ef.newRelationshipTypeElement('[:LIKES]'),
          ef.newDirectionElement('->'),
          ef.newNodeLabelElement('(:Item)'),
          ef.newDirectionElement('<-'),
          ef.newRelationshipElement('HAS_STOCK', 'hasStock'),
          ef.newDirectionElement('-'),
          ef.newNodeElement('Store', 'store'),
        ]),
        null,
        new OrderByQueries([]),
        null,
        []
      ),
      new Depth(2)
    );

    expect(stemQueryContext.getPathLiteral().get()).toBe(
      '(n0:User)-[r2:LIKES]->(n0:Item)<-[r2:HAS_STOCK]-(n0:Store)'
    );
    expect(stemQueryContext.getMapEntries()).toStrictEqual([
      ['user', 'n0{.*}'],
      ['hasStock', 'r2{.*}'],
      ['store', 'n0{.*}'],
    ]);
  });

  test('N-R-N with parameter', () => {
    const ef = new ElementFixture();

    const stemQueryContext = new StemQueryContext(
      new Stem(
        Path.new([
          ef.newNodeElement('User', 'user'),
          ef.newDirectionElement('-'),
          ef.newRelationshipElement('LIKES', 'likes'),
          ef.newDirectionElement('->'),
          ef.newNodeElement('Item', 'item'),
        ]),
        null,
        new OrderByQueries([]),
        null,
        []
      ),
      new Depth(2)
    );

    expect(stemQueryContext.getPathLiteral().get()).toBe(
      '(n0:User)-[r2:LIKES]->(n0:Item)'
    );
    expect(stemQueryContext.getMapEntries()).toStrictEqual([
      ['user', 'n0{.*}'],
      ['likes', 'r2{.*}'],
      ['item', 'n0{.*}'],
    ]);
  });
});
