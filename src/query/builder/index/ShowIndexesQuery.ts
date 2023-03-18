import { SessionProviderInterface } from '../../driver/SessionProviderInterface';

export class ShowIndexesQuery {
  constructor(private readonly sessionProvider: SessionProviderInterface) {}

  getStatement(): string {
    return 'SHOW INDEXES';
  }

  async run(): Promise<string[]> {
    const result = await this.sessionProvider.run(this.getStatement(), {});
    return result.records
      .map(
        (result) =>
          result.toObject() as { name: string; owingConstraint: string }
      )
      .filter((index) => index.owingConstraint === null)
      .map((index) => index.name);
  }
}
