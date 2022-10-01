import { TransformationRule } from './TransformationRule';

export class TransformationRules {
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
