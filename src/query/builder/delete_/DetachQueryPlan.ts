import { Driver } from 'neo4j-driver';
import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { Direction } from '../../../domain/graph/Direction';
import { DetachQueryBuilder } from './DetachQueryBuilder';

export class DetachQueryPlan {
  static new(driver: Driver): DetachQueryPlan {
    return new DetachQueryPlan(DetachQueryBuilder.new(), driver);
  }

  private readonly detachQueryBuilder: DetachQueryBuilder;
  private readonly driver: Driver;

  constructor(detachQueryBuilder: DetachQueryBuilder, driver: Driver) {
    this.detachQueryBuilder = detachQueryBuilder;
    this.driver = driver;
  }

  async execute(
    node1: InstanceType<ClassConstructor<object>> | NodeLabel,
    relationshipType: RelationshipType,
    node2: InstanceType<ClassConstructor<object>> | NodeLabel,
    direction: Direction
  ): Promise<void> {
    const [query, parameterBag] = this.detachQueryBuilder.build(
      node1,
      relationshipType,
      node2,
      direction
    );

    await this.driver.session().run(query.get(), parameterBag.toPlain());
  }
}
