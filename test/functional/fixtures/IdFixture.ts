import { randomUUID } from 'crypto';

export class IdFixture {
  private readonly idMap: Record<string, string> = {};

  get(key: string): string {
    if (!this.idMap[key]) {
      this.idMap[key] = randomUUID();
    }
    return this.idMap[key];
  }
}
