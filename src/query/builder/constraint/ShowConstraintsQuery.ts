import { SessionProviderInterface } from '../../driver/SessionProviderInterface';

export class ShowConstraintsQuery {
  constructor(private readonly sessionProvider: SessionProviderInterface) {}

  getStatement(): string {
    return 'SHOW CONSTRAINTS';
  }

  async run(): Promise<string[]> {
    const result = await this.sessionProvider.run(this.getStatement(), {});
    return result.records
      .map(
        (result) => result.toObject() as { name: string; ownedIndex: string }
      )
      .map((constraint) => constraint.name);
  }
}
