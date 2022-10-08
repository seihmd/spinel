import 'reflect-metadata';
import { IdFixture } from '../../fixtures/IdFixture';
import { SaveQueryPlan } from '../../../../src/query/builder/save/SaveQueryPlan';
import { Neo4jFixture } from '../../fixtures/neo4jFixture';
import { Primary } from '../../../../src/decorator/property/Primary';
import { Property } from '../../../../src/decorator/property/Property';
import { NodeEntity } from '../../../../src/decorator/class/NodeEntity';
import {
  Date as Neo4jDate,
  DateTime,
  Integer,
  LocalDateTime,
  LocalTime,
  Time,
} from 'neo4j-driver';

const neo4jFixture = Neo4jFixture.new();
const id = new IdFixture();

function int(value: number): Integer {
  return Integer.fromValue(value);
}

describe('Save various type of properties', () => {
  afterAll(async () => {
    await neo4jFixture.teardown();
  });

  test('Save temporal types', async () => {
    @NodeEntity()
    class Entity {
      @Primary() private id: string;
      @Property() private date: Date;
      @Property({ type: 'datetime' }) private dateTime: Date;
      @Property({ type: 'time' }) private time: Date;
      @Property({ type: 'local-datetime' }) private localDateTime: Date;
      @Property({ type: 'local-time' }) private localTime: Date;

      constructor(
        id: string,
        date: Date,
        dateTime: Date,
        time: Date,
        localDateTime: Date,
        localTime: Date
      ) {
        this.id = id;
        this.date = date;
        this.dateTime = dateTime;
        this.time = time;
        this.localDateTime = localDateTime;
        this.localTime = localTime;
      }
    }

    const saveQueryPlan = SaveQueryPlan.new(neo4jFixture.getDriver());
    const entity = new Entity(
      id.get('id'),
      new Date(2020, 0, 1, 1, 1, 1),
      new Date(2020, 0, 2, 2, 2, 2),
      new Date(2020, 0, 3, 3, 3, 3),
      new Date(2020, 0, 4, 4, 4, 4),
      new Date(2020, 0, 5, 5, 5, 5)
    );
    await saveQueryPlan.execute(entity);

    const savedValue = await neo4jFixture.findNode('Entity', id.get('id'));
    expect(savedValue.id).toStrictEqual(id.get('id'));
    expect(savedValue.date.toString()).toStrictEqual(
      Neo4jDate.fromStandardDate(new Date(2020, 0, 1, 1, 1, 1)).toString()
    );
    expect(savedValue.dateTime.toString()).toStrictEqual(
      DateTime.fromStandardDate(new Date(2020, 0, 2, 2, 2, 2)).toString()
    );
    expect(savedValue.time.toString()).toStrictEqual(
      Time.fromStandardDate(new Date(2020, 0, 3, 3, 3, 3)).toString()
    );
    expect(savedValue.localDateTime.toString()).toStrictEqual(
      LocalDateTime.fromStandardDate(new Date(2020, 0, 4, 4, 4, 4)).toString()
    );
    expect(savedValue.localTime.toString()).toStrictEqual(
      LocalTime.fromStandardDate(new Date(2020, 0, 5, 5, 5, 5)).toString()
    );
  });

  test('Save number types', async () => {
    @NodeEntity()
    class Entity {
      @Primary() private id: string;
      @Property() private intNumber: number;
      @Property() private floatNumber: number;
      @Property({ type: 'integer' }) private intInteger: number;
      @Property({ type: 'integer' }) private floatInteger: number;
      @Property() private intBigInt: bigint;
      @Property() private bigIntBigInt: bigint;

      constructor(
        id: string,
        intNumber: number,
        floatNumber: number,
        intInteger: number,
        floatInteger: number,
        intBigInt: bigint,
        bigIntBigInt: bigint
      ) {
        this.id = id;
        this.intNumber = intNumber;
        this.floatNumber = floatNumber;
        this.intInteger = intInteger;
        this.floatInteger = floatInteger;
        this.intBigInt = intBigInt;
        this.bigIntBigInt = bigIntBigInt;
      }
    }

    const saveQueryPlan = SaveQueryPlan.new(neo4jFixture.getDriver());
    const entity = new Entity(
      id.get('id'),
      1,
      1.1,
      2,
      2.1,
      3n,
      9007199254740992n
    );
    await saveQueryPlan.execute(entity);

    const savedValue = await neo4jFixture.findNode('Entity', id.get('id'));
    expect(savedValue).toStrictEqual({
      id: id.get('id'),
      intNumber: 1,
      floatNumber: 1.1,
      intInteger: Integer.fromValue(2),
      floatInteger: Integer.fromValue(2),
      intBigInt: 3,
      bigIntBigInt: Integer.fromValue(9007199254740992n),
    });
  });
});
