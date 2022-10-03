import { TransformationRule } from './TransformationRule';
import { NodeEntityMetadata } from '../../entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../../entity/RelationshipEntityMetadata';

export class TransformationRules {
  static new(entityMetadata: NodeEntityMetadata | RelationshipEntityMetadata) {
    return new TransformationRules(
      [...entityMetadata.getProperties(), entityMetadata.getPrimary()].map(
        (propertyMetadata) => {
          return TransformationRule.new(propertyMetadata);
        }
      )
    );
  }

  private map: Map<string, TransformationRule> = new Map();

  constructor(rules: TransformationRule[]) {
    rules.forEach((rule) => {
      this.map.set(rule.getKey(), rule);
    });
  }

  get(key: string): TransformationRule | null {
    return this.map.get(key) ?? null;
  }
}
